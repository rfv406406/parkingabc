from flask import *
from module.MYSQL import *
from module.JWT import *

id_data = Blueprint('GET_ID_PAGE_DATA', __name__)

@id_data.route("/api/get_id_page_data", methods = ["GET"])

def get_id_page_data():
    try:
        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)

        auth_header = request.headers.get('Authorization')
        if auth_header:
            payload = get_payload(auth_header)
            member_id = payload['member_id']
        else:
            return ({"error": True,"message": "please sign in"}), 403
        
        id_data = get_information_data(cursor, member_id)
        if id_data:
            return_data = {
                "data": id_data
            }
        else:
            return_data = {
                "data": "查無資料"
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


@id_data.route("/api/input_id_page_data", methods = ["POST"])

def input_booking_information():
    try:
        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)

        auth_header = request.headers.get('Authorization')
        if auth_header:
            payload = get_payload(auth_header)
            member_id = payload['member_id']
        else:
            return ({"error": True,"message": "please sign in"}), 403

        data = request.json
        
        if not data:
            return ({"error": True,"message": "data is not existed"}), 400
        update_information_data(cursor, data, member_id)
        connection.commit()

        return jsonify({"ok":"True"}), 200
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
