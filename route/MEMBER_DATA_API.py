from flask import *
from module.MYSQL import *
from module.JWT import *
from datetime import datetime

member_data = Blueprint('MEMBER_DATA_API', __name__)

@member_data.route("/api/get_member_data", methods = ["GET"])

def get_member_data():
    try:
        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)

        auth_header = request.headers.get('Authorization')
        if auth_header:
            payload = get_payload(auth_header)
            member_id = payload['member_id']
        else:
            return jsonify({"error": True,"message": "please sign in"}), 403

        member_data = get_uesr_datas(cursor, member_id)
        if member_data:
            return_data = {
                "data": member_data
            }
        else:
            return_data = {
                "data": "目前尚無停車資訊"
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