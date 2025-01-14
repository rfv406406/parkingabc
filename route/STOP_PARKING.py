from flask import *
from module.MYSQL import *
from module.JWT import *
from datetime import datetime
import math, traceback

check_out = Blueprint('STOP_PARKING', __name__)

@check_out.route("/api/input_stopping_data", methods = ["POST"])

def input_stopping_data():
    try:
        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        connection.start_transaction

        auth_header = request.headers.get('Authorization')
        # print(auth_header)
        if auth_header:
            payload = get_payload(auth_header)
            member_id = payload['member_id']
        else:
            return ({"error": True,"message": "please sign in"}), 403

        data = request.json
        
        if not data:
            return ({"error": True,"message": "data is not existed"}), 400
        # data = request.get_json()
        stoppingDataId = data['stopData']
        stoppingTime = data['stopTime']
        # 更新停車時間
        update_stoptime(cursor, stoppingTime, stoppingDataId, member_id)
        connection.commit()
        # 獲取停車data並計算費用
        parking_data_and_calculate_fee = get_parking_data_and_calculate_fee(cursor, stoppingDataId, member_id)
        starttime = parking_data_and_calculate_fee['starttime']
        price_per_hour = float(parking_data_and_calculate_fee['price'])
        parkinglotdata_id = parking_data_and_calculate_fee['parkinglotdata_id']
        square_number = parking_data_and_calculate_fee['square_number']
        order_number = parking_data_and_calculate_fee['order_number']
       
        # 計算總時間（分鐘）
        total_minutes = (datetime.strptime(stoppingTime, '%Y-%m-%d %H:%M:%S') - 
                         datetime.strptime(starttime, '%Y-%m-%d %H:%M:%S')).total_seconds() / 60

        # 根據新的計費邏輯計算費用
        if total_minutes <= 0.5:  # 5分內免費
            total_cost = 0
            income = 0

        if total_minutes <= 60:  # 不足1小時按小時計費
            total_cost = price_per_hour
        else:
            # 超過一小時，取整到最近的30分
            extra_minutes = total_minutes - 60
            total_hours = 1 + math.ceil(extra_minutes / 30) / 2
            total_cost = total_hours * price_per_hour

        if isinstance(total_cost, (list, tuple)) and len(total_cost) == 1:
            total_cost = total_cost[0]
            
        income = math.floor(total_cost * 0.9)
        # 開始事務 #保持一致性，以下程序如有一步失敗將會全部跳回
        # connection.start_transaction()
        # 更新 consumption 表的 payment
        update_consumption_payment(cursor, total_cost, income, stoppingDataId, member_id)
        # 插入交易記錄到 transactions 表
        insert_transactions(cursor, order_number, member_id, total_cost)
        # 更新 deposit_account 表的餘額
        update_deposit_account(cursor, total_cost, member_id)
        # 釋放停車位
        release_parkinglotsquare(cursor, parkinglotdata_id, square_number)
        member_parking_status_off(cursor, member_id)
        connection.commit()
        return jsonify({"ok":"True"}), 200
    except mysql.connector.Error as e:
        # traceback.print_exc()
        if connection and connection.is_connected():
            connection.rollback()
        print("Database Error", e)
        return jsonify({"error": True, "message": "Database Error"}), 500
    except Exception as e:
        # traceback.print_exc()
        if connection and connection.is_connected():
            connection.rollback()
        print("Internal Server Error", e)
        return jsonify({"error": True, "message": "Internal Server Error"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()