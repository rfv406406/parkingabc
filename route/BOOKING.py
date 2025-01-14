from flask import *
from module.MYSQL import *
from module.JWT import *
from datetime import datetime
import traceback

booking = Blueprint('BOOKING', __name__)

@booking.route("/api/input_booking_information", methods = ["POST"])

def input_booking_information():
    try:
        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        connection.start_transaction()

        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            payload = get_payload(auth_header)
            member_id = payload['member_id']
        else:
            return ({"error": True,"message": "please sign in"}), 403

        data = request.json
        
        if not data:
            return ({"error": True,"message": "data is not existed"}), 400

        order_number = datetime.utcnow().strftime('%Y%m%d%H%M%S%f')
        update_consumption(cursor, member_id, data, order_number)
        update_parkinglotsquare_status(cursor, data)
        member_parking_status_on(cursor, member_id)
        connection.commit()
        return jsonify({"ok":"True"}), 200
    except mysql.connector.Error as e:
        print("Database Error", e)
        if connection and connection.is_connected():
            connection.rollback()
        return jsonify({"error": True, "message": "Database Error"}), 500
    except Exception as e:
        traceback.print_exc()
        print("Internal Server Error", e)
        if connection and connection.is_connected():
            connection.rollback()
        return jsonify({"error": True, "message": "Internal Server Error"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@booking.route("/api/get_booking_information", methods = ["GET"])

def get_booking_information():
    try:
        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)

        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            payload = get_payload(auth_header)
            member_id = payload['member_id']
        else:
            return ({"error": True,"message": "please sign in"}), 403
        
        booking_information_data = get_booking_information_data(cursor, member_id)
        if booking_information_data:
            return_data = {
                "data": booking_information_data
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
