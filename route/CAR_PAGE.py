from flask import *
from module.MYSQL import *
from module.JWT import *
from module.S3 import *
from werkzeug.utils import secure_filename
import time

car_board = Blueprint('CAR_PAGE', __name__)

@car_board.route("/api/input_car_board_data", methods = ["GET","POST","DELETE"])

def input_car_board_data():
    if request.method == "POST":
        try:
            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)

            auth_header = request.headers.get('Authorization')

            if auth_header:
                payload = get_payload(auth_header)
                member_id = payload['member_id']
            else:
                return ({"error": True,"message": "please sign in"}), 403
   
            if not request.form:
                return ({"error": True,"message": "data is not existed"}), 400
            
            boardNumber = request.form.get('boardNumber')

            input_carboard_number(cursor, connection, member_id, boardNumber)
            car_images = request.files.getlist('img')
            car_id = cursor.lastrowid
            input_car_images(cursor, car_id, car_images)

            connection.commit()
            
            # cursor.close()
            # connection.close()
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
    
    if request.method == "GET":
        try:
            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)

            auth_header = request.headers.get('Authorization')

            if auth_header:
                payload = get_payload(auth_header)
                member_id = payload['member_id']
            else:
                return ({"error": True,"message": "please sign in"}), 403

            carboard_number_datas = get_carboard_number_datas(cursor, member_id)

            print(carboard_number_datas)
            car_ids = [carboard_number_data['id'] for carboard_number_data in carboard_number_datas]
            images = get_car_images(cursor, car_ids)
            print(images)
            for carboard_number_data in carboard_number_datas:
                carboard_number_data["images"] = [image["car_image"] for image in images]
            print(carboard_number_datas)

            return_data = {
                    "data": carboard_number_datas
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
            
    if request.method == "DELETE":
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
            car_id = data['id']  # 從停車場中獲取停車場數據的ID

            delete_car_image(cursor, car_id)
            delete_car(cursor, car_id, member_id)
            connection.commit()  

            return jsonify({"message": "deleted successfully"}), 200

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
