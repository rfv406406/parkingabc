from flask import *
from module.MYSQL import *
from module.JWT import *
from datetime import datetime
import math

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
            member_id = payload['id']

        data = request.json
        
        if not data:
            return ({"error": True,"message": "data is not existed"}), 400
        # data = request.get_json()
        stoppingDataId = data.get('stopData')
        stoppingTime = data.get('stopTime')
        # 更新停車時間
        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            UPDATE consumption
            SET stoptime = %s
            WHERE id = %s AND member_id = %s
        """, (stoppingTime, stoppingDataId, member_id))
        connection.commit()
        # 獲取停車data並計算費用
        cursor.execute("""
            SELECT starttime, price, parkinglotdata_id, square_number, order_number
            FROM consumption
            WHERE id = %s AND member_id = %s
        """, (stoppingDataId, member_id))
        
        row = cursor.fetchone()
        print(row)
        if row:
            starttime = row['starttime']
            price_per_hour = float(row['price'])
            parkinglotdata_id = row['parkinglotdata_id']
            square_number = row['square_number']
            order_number = row['order_number']
       
        # 計算總時間（分鐘）
        total_minutes = (datetime.strptime(stoppingTime, '%Y-%m-%d %H:%M:%S') - 
                         datetime.strptime(starttime, '%Y-%m-%d %H:%M:%S')).total_seconds() / 60

        # 根據新的計費邏輯計算費用
        if total_minutes <= 0.5:  # 5分钟内免费
            total_cost = 0
            income = 0
        else:
            if total_minutes <= 60:  # 不足1小时按1小时计费
                total_cost = price_per_hour
            else:
                # 超过1小时的部分，向上取整到最近的30分钟
                extra_minutes = total_minutes - 60
                total_hours = 1 + math.ceil(extra_minutes / 30) / 2
                total_cost = total_hours * price_per_hour
            if isinstance(total_cost, (list, tuple)) and len(total_cost) == 1:
                total_cost = total_cost[0]
            income = math.floor(total_cost * 0.9)
        # 開始事務 #保持一致性，以下程序如有一步失敗將會全部跳回
        # connection.start_transaction()
        # 更新 consumption 表的 payment
        cursor.execute("""
            UPDATE consumption
            SET payment = %s, income = %s
            WHERE id = %s AND member_id = %s
        """, (total_cost, income, stoppingDataId, member_id))
        print(total_cost)
        # 插入交易記錄到 transactions 表
        cursor.execute("""
            INSERT INTO transactions (order_number, deposit_account_id, Type, Amount, status)
            VALUES (%s, (SELECT id FROM deposit_account WHERE member_id = %s), 'WITHDRAWAL', %s, '已繳款')
        """, (order_number, member_id, total_cost))
        # 更新 deposit_account 表的餘額
        cursor.execute("""
            UPDATE deposit_account
            SET Balance = Balance - %s
            WHERE member_id = %s
        """, (total_cost, member_id))
        # 釋放停車位
        cursor.execute("""
            UPDATE parkinglotsquare
            SET status = NULL
            WHERE parkinglotdata_id = %s AND square_number = %s
        """, (parkinglotdata_id, square_number))
        cursor.execute("""
            UPDATE member
            SET status = NULL
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