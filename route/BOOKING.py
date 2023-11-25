from flask import Blueprint,jsonify,request
from module.MYSQL import *

booking = Blueprint('BOOKING', __name__)

@booking.route("/api/input_booking_information", methods = ["POST"])

def input_booking_information():
    try:
        auth_header = request.headers.get('Authorization')
        # print(auth_header)
        if auth_header is None:
            return ({"error": True,"message": "please sign in"}), 403
        else:
            token = auth_header.split(' ')[1]
            payload = decode_token(token)
            member_id = payload.get('id')

        data = request.json
        # print(data)
        if not data:
            return ({"error": True,"message": "data is not existed"}), 400

        # data = request.get_json()
        bookingData = data.get('bookingData')
        bookingTime = data.get('bookingTime')

        parking_lot_id = bookingData.get('id')
        parking_lot_name = bookingData.get('name')
        parking_lot_address = bookingData.get('address')
        parking_lot_price = bookingData.get('price')
        parking_lot_space_obj = bookingData.get('spaces')[0]
        parking_lot_space_id = parking_lot_space_obj.get('id')
        parking_lot_space_name = parking_lot_space_obj.get('number')
        

        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            INSERT INTO consumption(
                member_id, 
                date, 
                parkinglotdata_id, 
                parkinglotname, 
                parkinglotsquare, 
                square_number, 
                address,
                price,
                starttime,
                stoptime,
                payment
            ) 
            VALUES(%s, CURDATE(), %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (member_id, parking_lot_id, parking_lot_name, parking_lot_space_id, 
            parking_lot_space_name, parking_lot_address, parking_lot_price, bookingTime, stopTime, payment))
        # 更新 parkinglotspace 表中的 status
        cursor.execute("""
            UPDATE parkinglotsquare
            SET status = '使用中'
            WHERE id = %s
        """, (parking_lot_space_id,))

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
        # print(auth_header)
        if auth_header is None:
            return ({"error": True,"message": "please sign in"}), 403
        else:
            token = auth_header.split(' ')[1]
            payload = decode_token(token)
            member_id = payload.get('id')

        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        # 获取基本的停车场数据
        sql_query = (
            "SELECT id, member_id, date, parkinglotdata_id, parkinglotname, parkinglotsquare, "
            "square_number, address, price, starttime, stoptime, payment "
            "FROM consumption WHERE member_id = %s"
        )
        cursor.execute(sql_query, (member_id,))
        booking_information_data = cursor.fetchall()

        cursor.close()
        connection.close()

        return_data = {
            "data": booking_information_data
        }
        return jsonify(return_data), 200
    except mysql.connector.Error as e:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return jsonify({"error": True, "message": "databaseError"}), 500