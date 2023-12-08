from flask import *
from module.MYSQL import *
from module.JWT import *
from datetime import datetime

booking = Blueprint('BOOKING', __name__)

@booking.route("/api/input_booking_information", methods = ["POST"])

def input_booking_information():
    try:
        auth_header = request.headers.get('Authorization')
     
        if auth_header is None:
            return ({"error": True,"message": "please sign in"}), 403
        else:
            token = auth_header.split(' ')[1]
            payload = decode_token(token)
            member_id = payload.get('id')

        data = request.json
        
        if not data:
            return ({"error": True,"message": "data is not existed"}), 400

        # data = request.get_json()
        bookingData = data.get('bookingData')
        bookingTime = data.get('bookingTime')
        carBoardSelected = data.get('carBoardSelected')
        squareNumber = data.get('squareNumber')
        print(squareNumber)
        parking_lot_id = bookingData.get('id')
        parking_lot_name = bookingData.get('name')
        parking_lot_address = bookingData.get('address')
        parking_lot_price = bookingData.get('price')
        # parking_lot_squares_obj = bookingData.get('squares')[0]
        # parking_lot_squares_id = parking_lot_squares_obj.get('id')
        # parking_lot_squares_number = parking_lot_squares_obj.get('square_number')
        
        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        order_number = datetime.utcnow().strftime('%Y%m%d%H%M%S%f')
     
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
        """, (order_number, member_id, parking_lot_id, parking_lot_name,
            squareNumber, parking_lot_address, parking_lot_price, bookingTime, carBoardSelected))
        # 更新 parkinglotspace 表中的 status
        cursor.execute("""
            UPDATE parkinglotsquare
            SET status = '使用中'
            WHERE parkinglotdata_id = %s AND square_number = %s
        """, (parking_lot_id, squareNumber))

        cursor.execute("""
            UPDATE member
            SET status = '使用中'
            WHERE id = %s
        """, (member_id, ))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"ok":"True"}), 200
    except mysql.connector.Error:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return jsonify({"error": True,"message": "databaseError"}), 500

@booking.route("/api/get_booking_information", methods = ["GET"])

def get_booking_information():
    try:
        auth_header = request.headers.get('Authorization')
       
        if auth_header is None:
            return ({"error": True,"message": "please sign in"}), 403
        else:
            token = auth_header.split(' ')[1]
            payload = decode_token(token)
            print(payload)
            member_id = payload['id']

        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        # 获取基本的停车场数据
        sql_query = (
            "SELECT id, member_id, date, parkinglotdata_id, parkinglotname, parkinglotsquare, "
            "square_number, address, price, starttime, stoptime, payment "
            "FROM consumption WHERE member_id = %s AND stoptime IS NULL"
        )
        cursor.execute(sql_query, (member_id,))
        booking_information_data = cursor.fetchall()
     
        cursor.close()
        connection.close()
        if booking_information_data:
            return_data = {
                "data": booking_information_data
            }
        else:
            return_data = {
                "data": "目前尚無停車資訊"
            }
        return jsonify(return_data), 200
    except mysql.connector.Error as e:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return jsonify({"error": True, "message": "databaseError"}), 500