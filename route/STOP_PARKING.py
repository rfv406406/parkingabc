from flask import Blueprint,jsonify,request
from module.MYSQL import *
from datetime import datetime

check_out = Blueprint('STOP_PARKING', __name__)

@check_out.route("/api/input_stopping_data", methods = ["POST"])

def input_stopping_data():
    try:
        data = request.get_json()
        stoppingDataId = data.get('stopData')
        stoppingTime = data.get('stopTime')

        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            UPDATE income
            SET stoptime = %s
            WHERE id = %s
        """, (stoppingTime, stoppingDataId))

        cursor.execute("""
            SELECT starttime, price, parkinglot, parkinglotspacename
            FROM income
            WHERE id = %s
        """, (stoppingDataId,))
        row = cursor.fetchone()
        if row:
            starttime = row['starttime']
            price_per_hour = row['price']
            parkinglot = row['parkinglot']
            parkinglotspacename = row['parkinglotspacename']
        
         # 计算总时间（小时）
        total_hours = (datetime.strptime(stoppingTime, '%Y-%m-%d %H:%M:%S') - 
                    datetime.strptime(starttime, '%Y-%m-%d %H:%M:%S')).total_seconds() / 3600

        total_hours = float(total_hours)  # 转换为浮点数
        price_per_hour = float(price_per_hour)  # 同样转换为浮点数
        # 计算总费用
        total_cost = total_hours * price_per_hour
        cursor.execute("""
            UPDATE income
            SET income = %s
            WHERE id = %s
        """, (total_cost, stoppingDataId))

        cursor.execute("""
            UPDATE parkinglotspace
            SET status = NULL
            WHERE parkinglotdata = %s AND number = %s
        """, (parkinglot, parkinglotspacename))

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