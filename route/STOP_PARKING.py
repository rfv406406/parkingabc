from flask import Blueprint,jsonify,request
from module.MYSQL import *
from datetime import datetime

check_out = Blueprint('STOP_PARKING', __name__)

@check_out.route("/api/input_stopping_data", methods = ["POST"])

def input_stopping_data():
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
        stoppingDataId = data.get('stopData')
        stoppingTime = data.get('stopTime')

        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            UPDATE consumption
            SET stoptime = %s
            WHERE id = %s
        """, (stoppingTime, stoppingDataId))

        cursor.execute("""
            SELECT starttime, price, parkinglotdata_id, square_number
            FROM consumption
            WHERE id = %s
        """, (stoppingDataId,))
        row = cursor.fetchone()
        if row:
            starttime = row['starttime']
            price_per_hour = row['price']
            parkinglotdata_id = row['parkinglotdata_id']
            square_number = row['square_number']
        
         # 计算总时间（小时）
        total_hours = (datetime.strptime(stoppingTime, '%Y-%m-%d %H:%M:%S') - 
                    datetime.strptime(starttime, '%Y-%m-%d %H:%M:%S')).total_seconds() / 3600

        total_hours = float(total_hours)  # 转换为浮点数
        price_per_hour = float(price_per_hour)  # 同样转换为浮点数
        # 计算总费用
        total_cost = total_hours * price_per_hour
        cursor.execute("""
            UPDATE consumption
            SET consumption = %s
            WHERE id = %s
        """, (total_cost, stoppingDataId))

        cursor.execute("""
            UPDATE parkinglotsquare
            SET status = NULL
            WHERE parkinglotdata_id = %s AND number = %s
        """, (parkinglotdata_id, square_number))

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