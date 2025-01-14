from flask import *
from module.MYSQL import *
from module.JWT import *

cash_record = Blueprint('GET_CASH_RECORD', __name__)

@cash_record.route("/api/cash_record", methods = ["GET"])

def get_cash_record():
    try:
        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)

        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            payload = get_payload(auth_header)
            member_id = payload['member_id']
        else:
            return ({"error": True,"message": "please sign in"}), 403

        transactions_data = get_transactions(cursor, member_id)
        consumption_payment_data = get_consumption_payment_data(cursor, member_id)
        consumption_income_data = get_consumption_income_data(cursor, member_id)

        return_data = {
            'transactions': transactions_data if transactions_data else "no transactions data found",
            'consumption_payment': consumption_payment_data if consumption_payment_data else "no consumption_payment data found",
            'consumption_income': consumption_income_data if consumption_income_data else "no consumption_income data found"
        }
        return jsonify(return_data), 200
    
    except mysql.connector.Error as e:
        print("Database Error", e)
        return jsonify({"error": True, "message": "Database Error"}), 500
    except Exception as e:
        print("Internal Server Error", e)
        return jsonify({"error": True, "message": "Internal Server Error"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
