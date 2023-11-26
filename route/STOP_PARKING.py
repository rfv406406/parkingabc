from flask import *
from module.MYSQL import *
from module.JWT import *
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
            SELECT starttime, price, parkinglotdata_id, square_number
            FROM consumption
            WHERE id = %s AND member_id = %s
        """, (stoppingDataId, member_id))
        
        row = cursor.fetchone()
        print(row)
        if row:
            starttime = row['starttime']
            price_per_hour = row['price']
            parkinglotdata_id = row['parkinglotdata_id']
            square_number = row['square_number']
       
        # 計算總時間和費用
        total_hours = (datetime.strptime(stoppingTime, '%Y-%m-%d %H:%M:%S') - 
                    datetime.strptime(starttime, '%Y-%m-%d %H:%M:%S')).total_seconds() / 3600

        total_hours = float(total_hours)  # 浮點數
        price_per_hour = float(price_per_hour)  
        # 計算費用
        total_cost = total_hours * price_per_hour
        # 開始事務 #保持一致性，以下程序如有一步失敗將會全部跳回
        # connection.start_transaction()
        # 更新 consumption 表的 payment
        cursor.execute("""
            UPDATE consumption
            SET payment = %s
            WHERE id = %s AND member_id = %s
        """, (total_cost, stoppingDataId , member_id))
        print(total_cost)
        # 插入交易記錄到 transactions 表
        order_number = datetime.utcnow().strftime('%Y%m%d%H%M%S%f')
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