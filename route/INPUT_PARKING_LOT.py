from flask import Blueprint,jsonify,request
from module.MYSQL import *
from module.JWT import *
from module.S3 import *
from werkzeug.utils import secure_filename
import time, re, traceback

input_parking_lot = Blueprint('INPUT_PARKING_LOT', __name__)

@input_parking_lot.route("/api/input_parking_lot_information", methods = ["GET","POST","PUT","DELETE"])

def input_parking_lot_information():
    if request.method == "POST":
        try:
            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True, buffered=True)

            auth_header = request.headers.get('Authorization')
            if auth_header:
                payload = get_payload(auth_header)
                member_id = payload['member_id']
            else:
                return ({"error": True,"message": "please sign in"}), 403

            name = request.form.get('name')
            address = request.form.get('address')
            near_landmark = request.form.get('nearLandmark')
            opening_time_am = request.form.get('openingTimeAm')
            opening_time_pm = request.form.get('openingTimePm')
            space_in_out = request.form.get('spaceInOut')
            price = request.form.get('price')
            car_width = request.form.get('carWidth')
            car_height = request.form.get('carHeight')
            lng = request.form.get('Longitude')
            lat = request.form.get('Latitude')
            
            data = {'name':name, 
                    'address':address, 
                    'near_landmark':near_landmark, 
                    'opening_time_am':opening_time_am, 
                    'opening_time_pm':opening_time_pm, 
                    'space_in_out':space_in_out, 
                    'price':price, 
                    'car_width':car_width,
                    'car_height':car_height, 
                    'lng':lng, 
                    'lat':lat}
            
            for key in data:
                if data[key] is None:
                    return jsonify({'error':True, 'message':'DATA LOST'}), 403 
         
            parkinglotdata_id = input_parking_lot_informations(cursor, member_id, data)

            parking_lot_images = request.files.getlist('img')
            if parking_lot_images is None:
                    return jsonify({'error':True, 'message':'IMAGES DATA LOST'}), 403
            
            input_parkinglotimages(cursor, parking_lot_images, parkinglotdata_id, member_id)
            all_text_data = request.form.to_dict()
            input_parkinglotsquare(cursor, all_text_data, parkinglotdata_id)
            all_image_files = request.files.to_dict()
            connection.commit()      
            
            return jsonify({"ok":"True"}), 200
        except mysql.connector.Error as e:
            print("Database Error", e)
            if connection:
                connection.rollback()
            return jsonify({"error": True, "message": "Database Error"}), 500
        except Exception as e:
            traceback.print_exc()
            print("Internal Server Error", e)
            if connection:
                connection.rollback()
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
                        
            parkinglotdatas = get_parkinglotdatas(cursor)

            if parkinglotdatas:
                return_data = {
                    "data": parkinglotdatas
                }
            else: 
                return_data = {
                    "data": "no data found"
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
            connection.start_transaction()
            cursor = connection.cursor(dictionary=True)
            
            auth_header = request.headers.get('Authorization')
            if auth_header:
                payload = get_payload(auth_header)
                member_id = payload['member_id']
            else:
                return jsonify({"error": True,"message": "PLEASE SIGN IN"}), 403

            data = request.json
            if data:
                parkinglotdata_id = data
            else:
                return jsonify({"error": True, "message": "DATA LOST"}), 403  

            delete_parkinglotdatas(cursor, parkinglotdata_id, member_id)
                
            connection.commit()  

            return jsonify({"message": "deleted successfully"}), 200
        
        except mysql.connector.Error as e:
            if connection and connection.is_connected():
                connection.rollback()
            print("Database Error", e)
            return jsonify({"error": True,"message": "DATABASE ERROR"}), 500
        except Exception as e:
            if connection and connection.is_connected():
                connection.rollback()
            print('Internal Server Error', e)
            return jsonify({'error':True,'message':'Internal Server Error'}), 500
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()

    if request.method == "PUT":
        try:
            connection = con.get_connection()
            connection.start_transaction()
            cursor = connection.cursor(dictionary=True)
            
            auth_header = request.headers.get('Authorization')
            if auth_header:
                payload = get_payload(auth_header)
                member_id = payload['member_id']
            else:
                return jsonify({"error": True,"message": "PLEASE SIGN IN"}), 403

            data = request.form
            parkinglotdata_id = data['id']
            if data:
                edit_parkinglotdatas(cursor, data, parkinglotdata_id, member_id)
            else:
                return jsonify({"error": True, "message": "DATA LOST"}), 403

            parking_lot_images = request.files.getlist('img')
            if parking_lot_images:
                edit_parkinglotimages(cursor, parking_lot_images, parkinglotdata_id, member_id)
            else:
                return jsonify({'error': True, 'message': 'DATA LOST'}), 403

            all_text_data = request.form.to_dict()
            if all_text_data:
                edit_parkinglotsquare(cursor, all_text_data, parkinglotdata_id, member_id)
            else:
                return jsonify({'error': 'True', 'message': 'DATA LOST'})

            parking_square_image = request.files.items()
            
            if parking_square_image:
                edit_parkingsquareimage(cursor, parking_square_image)
            else:
                return jsonify({'error': 'True', 'message': 'DATA LOST'})

            connection.commit()      
            return jsonify({"ok":"True"}), 200
        except mysql.connector.Error as e:
            print("Database Error", e)
            if connection and connection.is_connected():
                connection.rollback()
            return jsonify({"error": True, "message": "Database Error"}), 500
        except Exception as e:
            print("Internal Server Error", e)
            if connection and connection.is_connected():
                connection.rollback()
            return jsonify({"error": True, "message": "Internal Server Error"}), 500
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()


      