from flask import *
from dotenv import load_dotenv
from module.S3 import *
from werkzeug.utils import secure_filename
import os, time, re
load_dotenv()

import mysql.connector
from mysql.connector import pooling
config = {
    "host":os.getenv('HOST'),
    "user":os.getenv('USER'),
    "password":os.getenv('PASSWORD'),
    "database":os.getenv('DATABASE'),
    # "host":"db-stage3-week1.cxzjwrl3yccb.us-east-1.rds.amazonaws.com",
    # "port":3306,
    # "user":"root",
    # "password":"12345678",
    # "database":"Stage3",
}
con =  pooling.MySQLConnectionPool(pool_name = "mypool",
                              pool_size = 20,
                              **config)

def get_user_email(cursor, data):
    cursor.execute("SELECT email FROM member WHERE email= %s", (data["signupEmail"],))
    data = cursor.fetchone()
    return data

def get_user_account_datas(cursor, data):
    cursor.execute("SELECT id, account, email FROM member WHERE account= %s AND password= %s", (data['account'], data['password']))
    data = cursor.fetchone()
    return data

def user_infor_input_database(cursor, data):
    cursor.execute("INSERT INTO member(account, email, password) VALUES(%s, %s, %s)", (data["signupAccount"], data["signupEmail"], data["signupPassword"]))
    member_id = cursor.lastrowid # 獲取剛插入行的ID
    return member_id

def create_deposit_account(cursor, member_id):
    cursor.execute("INSERT INTO deposit_account(member_id) VALUES(%s)", (member_id,))

def get_uesr_datas(cursor, member_id):
    cursor.execute("SELECT member.status, deposit_account.Balance FROM member JOIN deposit_account ON member.id = deposit_account.member_id WHERE member.id = %s", (member_id,))
    uesr_datas = cursor.fetchone()
    return uesr_datas
# /api/edit_input_parking_lot_information-----------------------------------------------------------------------------------------------

# def get_parkinglotdatas(cursor, member_id):
#     cursor.execute("SELECT * FROM parkinglotdata WHERE member_id = %s", (member_id,))
#     parkinglotdatas = cursor.fetchall()
#     return parkinglotdatas

# def get_parkinglotimages(cursor, parkinglotdatas):
#     cursor.execute("SELECT image FROM parkinglotimage WHERE parkinglotdata_id = %s", (parkinglotdatas["id"],))
#     images = cursor.fetchall()
#     return images

# def get_parkinglotsquaredatas(cursor, parkinglotdatas):
#     cursor.execute("SELECT id, square_unmber, status FROM parkinglotsquare WHERE parkinglotdata_id = %s", (parkinglotdatas["id"],))
#     datas = cursor.fetchall()

def get_parkinglotdatas(cursor):
    cursor.execute('SET SESSION group_concat_max_len = 10000000')
    cursor.execute("""SELECT parkinglotdata.*, 
            GROUP_CONCAT(parkinglotimage.image SEPARATOR ',') AS images,
            GROUP_CONCAT(CONCAT(parkinglotsquare.parkinglotdata_id,':',parkinglotsquare.square_number,':',parkinglotsquare.status) ORDER BY parkinglotsquare.square_number SEPARATOR ',') AS squares
            FROM parkinglotdata
            LEFT JOIN parkinglotimage ON parkinglotdata.id = parkinglotimage.parkinglotdata_id
            LEFT JOIN parkinglotsquare ON parkinglotdata.id = parkinglotsquare.parkinglotdata_id
            GROUP BY parkinglotdata.id;
            """)
    parkinglotdatas = cursor.fetchall()
    
    for parkinglotdata in parkinglotdatas:
        squares = []
        datas = parkinglotdata['squares'].split(',')
        # print(datas)
        for data in datas:
            squares_dict = {}
            id, square_number, status = data.split(':')
            squares_dict['id'] = id
            squares_dict['square_number'] = square_number
            squares_dict['status'] = status
            squares.append(squares_dict)
        parkinglotdata['squares'] = squares
        # print(parkinglotdatas)
    return parkinglotdatas

def delete_parkinglotdatas(cursor, parkinglotdata_id, member_id):
    cursor.execute("""
                DELETE FROM parkingsquareimage 
                WHERE parkinglotsquare_id IN (
                    SELECT id FROM parkinglotsquare 
                    WHERE parkinglotdata_id = %s
                )
            """, (parkinglotdata_id,))
    cursor.execute("DELETE FROM parkinglotsquare WHERE parkinglotdata_id = %s", (parkinglotdata_id,))
    cursor.execute("DELETE FROM parkinglotimage WHERE parkinglotdata_id = %s", (parkinglotdata_id,))
    cursor.execute("DELETE FROM parkinglotdata WHERE id = %s AND member_id = %s", (parkinglotdata_id, member_id))

def edit_parkinglotdatas(cursor, data, parkinglotdata_id, member_id):
    cursor.execute('''
                   UPDATE parkinglotdata SET name = %s, 
                   address = %s, 
                   landmark = %s, 
                   openingTime = %s, 
                   closingTime = %s, 
                   spaceInOut = %s, 
                   price = %s, 
                   widthLimit = %s, 
                   heightLimit = %s, 
                   lng = %s, 
                   lat = %s 
                   WHERE id = %s AND member_id = %s''', 
                   (data['name'], data['address'], data['nearLandmark'], 
                    data['openingTimeAm'], data['openingTimePm'], 
                    data['spaceInOut'], data['price'], 
                    data['carWidth'], data['carHeight'], 
                    data['Longitude'], data['Latitude'], 
                    parkinglotdata_id, member_id))
    
def edit_parkinglotimages(cursor, parking_lot_images, parkinglotdata_id, member_id):
    for image in parking_lot_images:
        if image and image.filename.endswith(('jpg', 'jpeg', 'png', 'jfif')):
            filename = secure_filename(image.filename)
            # s3_client.upload_fileobj(image, BUCKET_NAME, filename)
            image_url = f"https://d1hxt3hn1q2xo2.cloudfront.net/{filename}"
            # print(image_url)
            insert_query = """
                UPDATE parkinglotimage SET parkinglotdata_id = %s, image = %s
            """
            cursor.execute(insert_query, (parkinglotdata_id, image_url))

def edit_parkinglotsquare(cursor, all_text_data, parkinglotdata_id, member_id):
    for key, value in all_text_data.items():
        if key.startswith('parkingSquareNumber'):
            cursor.execute('UPDATE parkinglotsquare SET parkinglotdata_id= %s, square_number= %s', (parkinglotdata_id, value))

def edit_parkingsquareimage(cursor, parking_square_image):
    for key, image in parking_square_image:
        if key.startswith("parkingSquareImage") and image:
            # 使用正則表達式提取數字
            match = re.search(r'parkingSquareImage(\d+)', key)
            if match:
                parkinglotsquare_id = int(match.group(1))
            else:
                parkinglotsquare_id = 1
            
            filename = secure_filename(image.filename)
            # 假設 s3_client 已經被正確初始化
            # s3_client.upload_fileobj(image, BUCKET_NAME, filename)
            image_url = f"https://d1hxt3hn1q2xo2.cloudfront.net/{filename}"

            cursor.execute('UPDATE parkingsquareimage SET parkinglotsquare_id = %s, image = %s', (parkinglotsquare_id, image_url))

# /api/input_parking_lot_information-----------------------------------------------------------------------------------------------------

def input_parking_lot_informations(cursor, member_id, data):
    cursor.execute("""
                   INSERT INTO parkinglotdata(
                    member_id,
                    name, 
                    address, 
                    landmark, 
                    openingTime, 
                    closingTime, 
                    spaceInOut, 
                    price, 
                    widthLimit, 
                    heightLimit, 
                    lng, 
                    lat
                   )
                   VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                   """, (member_id, data['name'], data['address'], data['near_landmark'], data['opening_time_am'], data['opening_time_pm'], 
                data['space_in_out'], data['price'], data['car_width'], data['car_height'], data['lng'], data['lat']))
    cursor.execute("SELECT id FROM parkinglotdata WHERE member_id = %s ORDER BY id DESC LIMIT 1", (member_id,))
    parkinglotdata_id = cursor.fetchone()
    print(parkinglotdata_id)
    return parkinglotdata_id["id"]

    
def input_parkinglotimages(cursor, parking_lot_images, parkinglotdata_id, member_id):
    for image in parking_lot_images:
        if image and image.filename.endswith(('jpg', 'jpeg', 'png', 'jfif')):
            filename = secure_filename(image.filename)
            # s3_client.upload_fileobj(image, BUCKET_NAME, filename)
            image_url = f"https://d1hxt3hn1q2xo2.cloudfront.net/{filename}"
            insert_query = """
                INSERT INTO parkinglotimage(parkinglotdata_id, image) VALUES(%s, %s)
            """
            cursor.execute(insert_query, (parkinglotdata_id, image_url))

def input_parkinglotsquare(cursor, all_text_data, parkinglotdata_id):
    for key, value in all_text_data.items():
        if key.startswith('parkingSquareNumber'):
            cursor.execute('INSERT INTO parkinglotsquare(parkinglotdata_id, square_number, status) VALUES(%s, %s, %s)', (parkinglotdata_id, value, "閒置中"))
# api_pay()--------------------------------------------------------------------------------------------------------------------------------------

def get_deposit_account_id(cursor, member_id):
    cursor.execute("""
    SELECT deposit_account.id FROM deposit_account WHERE member_id = %s
    """, (member_id,))
    deposit_account_id = cursor.fetchone()
    return deposit_account_id

def depositting(cursor, order_number, deposit_account_id, deposit):
    cursor.execute("""
    INSERT INTO transactions(
        order_number, deposit_account_id, Type, Amount, status
    )
    VALUES(%s, %s, %s, %s, %s)
    """, (order_number, deposit_account_id, 'DEPOSIT', deposit, '未繳款')
    )

def deposit_status_change(cursor, order_number, deposit_account_id,):
    cursor.execute("""
    UPDATE transactions 
    SET status = %s 
    WHERE order_number = %s AND deposit_account_id = %s
                   """, ('已繳款', order_number, deposit_account_id))
def deposit_account_balance_change(cursor, deposit, member_id):
    cursor.execute("""
    UPDATE deposit_account
    SET Balance = Balance + %s
    WHERE member_id = %s
                   """, (deposit, member_id))
# /api/input_stopping_data----------------------------------------------------------------------------
def update_stoptime(cursor, stoppingTime, stoppingDataId, member_id):
    cursor.execute("""
            UPDATE consumption
            SET stoptime = %s
            WHERE id = %s AND member_id = %s
        """, (stoppingTime, stoppingDataId, member_id))
def get_parking_data_and_calculate_fee(cursor, stoppingDataId, member_id):
    cursor.execute("""
            SELECT starttime, price, parkinglotdata_id, square_number, order_number
            FROM consumption
            WHERE id = %s AND member_id = %s
        """, (stoppingDataId, member_id))
    parking_data_and_calculate_fee = cursor.fetchone()
    return parking_data_and_calculate_fee
def update_consumption_payment(cursor, total_cost, income, stoppingDataId, member_id):
    cursor.execute("""
            UPDATE consumption
            SET payment = %s, income = %s
            WHERE id = %s AND member_id = %s
        """, (total_cost, income, stoppingDataId, member_id))
def insert_transactions(cursor, order_number, member_id, total_cost):
    cursor.execute("""
            INSERT INTO transactions (order_number, deposit_account_id, Type, Amount, status)
            VALUES (%s, (SELECT id FROM deposit_account WHERE member_id = %s), 'WITHDRAWAL', %s, '已繳款')
        """, (order_number, member_id, total_cost))
def update_deposit_account(cursor, total_cost, member_id):
    cursor.execute("""
            UPDATE deposit_account
            SET Balance = Balance - %s
            WHERE member_id = %s
        """, (total_cost, member_id))
def release_parkinglotsquare(cursor, parkinglotdata_id, square_number):
    cursor.execute("""
            UPDATE parkinglotsquare
            SET status = '閒置中'
            WHERE parkinglotdata_id = %s AND square_number = %s
        """, (parkinglotdata_id, square_number))
def member_parking_status_off(cursor, member_id):
    cursor.execute("""
            UPDATE member
            SET status = NULL
            WHERE id = %s
        """, (member_id, ))
# /api/get_id_page_data----------------------------------------------------------------------------------------------
def get_information_data(cursor, member_id):
    cursor.execute("""
            SELECT
                id,
                name,
                birthday,
                cellphone,
                email,
                account,
                status,
                RegistrationDate
            FROM
                member
            WHERE
                id = %s;
                   """, (member_id,))
    id_data = cursor.fetchone()
    return id_data
def update_information_data(cursor, data, member_id):
    sql_query = "UPDATE member SET "
    params = ()

    if data['name']:
        sql_query += "name = %s,"
        params += (data['name'],)
    if data['email']:
        sql_query += "email = %s,"
        params += (data['email'],)
    if data['birthday']:
        sql_query += "birthday = %s,"
        params += (data['birthday'],)
    if data['cellphone']:
        sql_query += "cellphone = %s,"
        params += (data['cellphone'],)
    if data['password']:
        sql_query += "password = %s,"
        params += (data['password'],)

    
    sql_query = sql_query.rstrip(",") + " WHERE id = %s"
    params += (member_id,)

    cursor.execute(sql_query, params)
# /api/cash_record-------------------------------------------------------------------------------------------
def get_transactions(cursor, member_id):
    deposit_account_id = get_deposit_account_id(cursor, member_id)
    id = deposit_account_id['id']
    cursor.execute("""
            SELECT * FROM transactions 
            WHERE deposit_account_id = %s""", 
            (id,))
    transactions_data = cursor.fetchall()
    return transactions_data
def get_consumption_payment_data(cursor, member_id):
    cursor.execute("""
            SELECT
                id,
                date,
                member_id,
                order_number,
                address,
                parkinglotdata_id,
                parkinglotname,
                parkinglotsquare,
                square_number,
                car_board,
                price,
                starttime,
                stoptime,
                payment
            FROM consumption
            WHERE member_id = %s
        """, (member_id,))
    consumption_payment_data = cursor.fetchall()
    return consumption_payment_data
def get_consumption_income_data(cursor, member_id):
    cursor.execute("""
            SELECT
                consumption.id,
                consumption.date,
                consumption.member_id,
                consumption.order_number,
                consumption.address,
                consumption.parkinglotdata_id,
                consumption.parkinglotname,
                consumption.parkinglotsquare,
                consumption.square_number,
                consumption.car_board,
                consumption.price,
                consumption.starttime,
                consumption.stoptime,
                consumption.income
            FROM consumption
            JOIN parkinglotdata ON consumption.parkinglotdata_id = parkinglotdata.id
            WHERE parkinglotdata.member_id = %s
        """, (member_id,))
    consumption_income_data = cursor.fetchall()
    return consumption_income_data
# /api/input_car_board_data----------------------------------------------------------------------
def input_carboard_number(cursor, connection, member_id, boardNumber):
    cursor.execute("""
                INSERT INTO car (member_id, carboard_number)
                VALUES (%s, %s);
            """, (member_id, boardNumber))
    connection.commit()
def input_car_images(cursor, car_id, car_images):
    for image in car_images:
        if image and image.filename.endswith(('jpg', 'jpeg', 'png', 'jfif')):
            filename = secure_filename(image.filename)
            # s3_client.upload_fileobj(image, BUCKET_NAME, filename)
            image_url = f"https://d1hxt3hn1q2xo2.cloudfront.net/{filename}"
            insert_query = """
                INSERT INTO car_image (car_id, car_image)
                VALUES (%s, %s);
            """
            cursor.execute(insert_query, (car_id, image_url))
def get_carboard_number_datas(cursor, member_id):
    cursor.execute("SELECT * FROM car WHERE member_id = %s", (member_id,))
    carboard_number_datas = cursor.fetchall()
    return carboard_number_datas
def get_car_images(cursor, car_ids):
    if not car_ids:
        return []
    placeholders = ','.join(['%s'] * len(car_ids))
    query = f"SELECT car_image FROM car_image WHERE car_id IN ({placeholders})"
    cursor.execute(query, car_ids)
    images = cursor.fetchall()
    return images
def delete_car_image(cursor, car_id):
    cursor.execute("DELETE FROM car_image WHERE car_id = %s", (car_id,))
def delete_car(cursor, car_id, member_id):
    cursor.execute("DELETE FROM car WHERE id = %s AND member_id = %s", (car_id, member_id))
# /api/input_booking_information---------------------------------------------------------------------
def update_consumption(cursor, member_id, data, order_number):
    cursor.execute("""
            INSERT INTO consumption(
                order_number,
                member_id,
                parkinglotdata_id, 
                parkinglotname, 
                square_number, 
                address,
                price,
                starttime,
                car_board
            ) 
            VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (order_number, member_id, data['bookingData']['id'], data['bookingData']['name'],
            data['bookingData']['squares'][0]['square_number'], data['bookingData']['address'], data['bookingData']['price'], 
            data['bookingTime'], data['carBoardSelected']))
def update_parkinglotsquare_status(cursor, data):
    cursor.execute("""
            UPDATE parkinglotsquare
            SET status = '使用中'
            WHERE parkinglotdata_id = %s AND square_number = %s
        """, (data['bookingData']['id'], data['bookingData']['squares'][0]['square_number']))
def member_parking_status_on(cursor, member_id):
    cursor.execute("""
            UPDATE member
            SET status = '停車中'
            WHERE id = %s
        """, (member_id, ))
def get_booking_information_data(cursor, member_id):
    cursor.execute("""
            SELECT id, member_id, date, parkinglotdata_id, parkinglotname, parkinglotsquare,
            square_number, address, price, starttime, stoptime, payment 
            FROM consumption WHERE member_id = %s AND stoptime IS NULL
        """, (member_id, ))
    booking_information_data = cursor.fetchall()
    return booking_information_data
