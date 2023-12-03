from flask import Blueprint,jsonify,request
from module.MYSQL import *
from module.JWT import *
from module.S3 import *
from werkzeug.utils import secure_filename
import time, re

parking_lot_page = Blueprint('PARKING_LOT_PAGE', __name__)

@parking_lot_page.route("/api/edit_input_parking_lot_information", methods = ["GET","POST","DELETE"])

def edit_input_parking_lot_information(): 
    if request.method == "GET":
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
            # 获取基本的停车场数据
            cursor.execute("SELECT * FROM `parkinglotdata` WHERE `member_id` = %s", (member_id,))
            parking_lot_datas = cursor.fetchall()

            # 为每个停车场获取图像和空间信息
            for parking_lot_data in parking_lot_datas:
                # 获取图像
                cursor.execute("SELECT image FROM parkinglotimage WHERE parkinglotdata_id = %s", (parking_lot_data["id"],))
                images = cursor.fetchall()
                parking_lot_data["images"] = [image["image"] for image in images]
                
                # 获取空间信息
                cursor.execute("SELECT id, square_number, status FROM parkinglotsquare WHERE parkinglotdata_id = %s", (parking_lot_data["id"],))
                squares = cursor.fetchall()
                parking_lot_data["squares"] = [{"id": square["id"], "square_number": square["square_number"], "status": square["status"]} for square in squares]
                # print(squares)
            cursor.close()
            connection.close()

            if parking_lot_datas is not None:  # Check if parking_lot_datas is not None
                return_data = {
                    "data": parking_lot_datas
                }
            else:  # This will execute if parking_lot_datas is None
                return_data = {
                    "data": "no data found"
                }
            
            return jsonify(return_data), 200
        except mysql.connector.Error as e:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
            return jsonify({"error": True, "message": "databaseError"}), 500 
        
    if request.method == "DELETE":
        try:
            auth_header = request.headers.get('Authorization')
            if auth_header is None:
                return jsonify({"error": True, "message": "Please sign in"}), 403
            else:
                token = auth_header.split(' ')[1]
                payload = decode_token(token)
                member_id = payload.get('id')

            data = request.json
            parkinglotdata_id = data.get('id')  # 从请求中获取停车场数据的ID

            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)

            # 删除 parkingsquareimage 相关数据
            cursor.execute("""
                DELETE FROM parkingsquareimage 
                WHERE parkinglotsquare_id IN (
                    SELECT id FROM parkinglotsquare 
                    WHERE parkinglotdata_id = %s
                )
            """, (parkinglotdata_id,))

            # 删除 parkinglotsquare 相关数据
            cursor.execute("DELETE FROM parkinglotsquare WHERE parkinglotdata_id = %s", (parkinglotdata_id,))

            # 删除 parkinglotimage 相关数据
            cursor.execute("DELETE FROM parkinglotimage WHERE parkinglotdata_id = %s", (parkinglotdata_id,))

            # 最后删除 parkinglotdata 本身
            cursor.execute("DELETE FROM parkinglotdata WHERE id = %s AND member_id = %s", (parkinglotdata_id, member_id))

            connection.commit()  # 确保提交事务以保存更改

            cursor.close()
            connection.close()

            return jsonify({"message": "deleted successfully"}), 200

        except mysql.connector.Error as e:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
            return jsonify({"error": True, "message": "Database error"}), 500
    if request.method == "POST":
        try:
            auth_header = request.headers.get('Authorization')
            if auth_header is None:
                return jsonify({"error": True, "message": "Please sign in"}), 403
            else:
                token = auth_header.split(' ')[1]
                payload = decode_token(token)
                member_id = payload.get('id')

            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)

            parkinglotdata_id = request.form.get('id') 
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

            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)
            update_query = """
                UPDATE parkinglotdata SET
                name = %s, 
                address = %s, 
                landmark = %s, 
                openingTime = %s, 
                closingTime = %s, 
                spaceInOut = %s, 
                price = %s, 
                widthLimit = %s, 
                heightLimit = %s, 
                lng = %s, 
                lat = %s
                WHERE id = %s AND member_id = %s
            """
            cursor.execute(update_query, (name, address, near_landmark, opening_time_am, opening_time_pm, space_in_out, price, car_width, car_height, lng, lat, parkinglotdata_id, member_id))
            connection.commit()            
            # 删除 parkingsquareimage 相关数据
            cursor.execute("""
                DELETE FROM parkingsquareimage 
                WHERE parkinglotsquare_id IN (
                    SELECT id FROM parkinglotsquare 
                    WHERE parkinglotdata_id = %s
                )
            """, (parkinglotdata_id,))

            # 删除 parkinglotsquare 相关数据
            cursor.execute("DELETE FROM parkinglotsquare WHERE parkinglotdata_id = %s", (parkinglotdata_id,))

            # 删除 parkinglotimage 相关数据
            cursor.execute("DELETE FROM parkinglotimage WHERE parkinglotdata_id = %s", (parkinglotdata_id,))
            connection.commit()

            parking_lot_images = request.files.getlist('img')
            for image in parking_lot_images:
                if image and image.filename.endswith(('jpg', 'jpeg', 'png', 'jfif')):
                    filename = secure_filename(image.filename)
                    key = f"{str(int(time.time()))}-{filename}" # 生成檔案名稱
                    s3_client.upload_fileobj(image, BUCKET_NAME, key)
                    image_url = f"https://d1hxt3hn1q2xo2.cloudfront.net/{key}"
                    # print(image_url)
                    # 将 image_url 和 parkinglotdata_id 保存到数据库
                    insert_query = """
                        INSERT INTO parkinglotimage (parkinglotdata_id, image)
                        VALUES (%s, %s);
                    """
                    cursor.execute(insert_query, (parkinglotdata_id, image_url))
            connection.commit()


            all_text_data = request.form.to_dict()
            # print(all_text_data)
            for key, value in all_text_data.items():
                if key.startswith("parkingSquareNumber"):
                    insert_query = """
                            INSERT INTO parkinglotsquare (parkinglotdata_id, square_number)
                            VALUES (%s, %s);
                        """
                    cursor.execute(insert_query, (parkinglotdata_id, value))
            connection.commit()  

            # all_image_files = request.files.to_dict()
            for key, image in request.files.items():
                if key.startswith("parkingSquareImage") and image:
                    # 使用正則表達式提取數字
                    match = re.search(r'parkingSquareImage(\d+)', key)
                    parkinglotsquare_id = int(match.group(1)) if match else 1

                    filename = secure_filename(image.filename)
                    key = f"{str(int(time.time()))}-{filename}"
                    
                    # 假設 s3_client 已經被正確初始化
                    s3_client.upload_fileobj(image, BUCKET_NAME, key)
                    image_url = f"https://d1hxt3hn1q2xo2.cloudfront.net/{key}"
                    print(image_url)
                    
                    # 假設 cursor 已經被正確初始化
                    insert_query = """
                        INSERT INTO parkingsquareimage (parkinglotsquare_id, image)
                        VALUES (%s, %s);
                    """
                    cursor.execute(insert_query, (parkinglotsquare_id, image_url))
            connection.commit()      
            
            cursor.close()
            connection.close()
            return jsonify({"ok":"True"}), 200

        except mysql.connector.Error as e:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
            return jsonify({"error": True, "message": "Database error"}), 500