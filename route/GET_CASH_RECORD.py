from flask import *
from module.MYSQL import *
from module.JWT import *
from module.GET_DEPOSIT_ACCOUNT_ID import *

cash_record = Blueprint('GET_CASH_RECORD', __name__)

@cash_record.route("/api/cash_record", methods = ["GET"])

def get_cash_record():
    try:
        auth_header = request.headers.get('Authorization')
        # print(auth_header)
        if auth_header is None:
            return ({"error": True,"message": "please signin"}), 403
        else:
            token = auth_header.split(' ')[1]
            payload = decode_token(token)
            member_id = payload.get('id')

        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        # 从 transactions 表查询
        cursor.execute("SELECT * FROM transactions WHERE deposit_account_id = %s", (get_deposit_account_id(member_id),))
        transactions_data = cursor.fetchall()

        # 从 consumption 表查询
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
                income
            FROM consumption
            WHERE member_id = %s
        """, (member_id,))
        consumption_income_data = cursor.fetchall()

        cursor.close()
        connection.close()

        return_data = {
            'transactions': transactions_data if transactions_data else "no transactions data found",
            'consumption_payment': consumption_payment_data if consumption_payment_data else "no consumption_payment data found",
            'consumption_income': consumption_income_data if consumption_income_data else "no consumption_income data found"
        }
        
        return jsonify(return_data), 200
    except mysql.connector.Error as e:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return jsonify({"error": True, "message": "databaseError"}), 500