from flask import Blueprint,jsonify,request
from module.MYSQL import *
from module.S3 import *
from werkzeug.utils import secure_filename
import time, re

input_parking_lot = Blueprint('INPUT_PARKING_LOT', __name__)

@input_parking_lot.route("/api/input_parking_lot_information", methods = ["GET","POST"])

def input_parking_lot_information():
    if request.method == "POST":
        try:
            name = request.form.get('name')
            address = request.form.get('address')
            near_landmark = request.form.get('nearLandmark')
            opening_time_am = request.form.get('openingTimeAm')
            opening_time_pm = request.form.get('openingTimePm')
            space = request.form.get('space')
            price = request.form.get('price')
            car_width = request.form.get('carWidth')
            car_height = request.form.get('carHeight')
            lng = request.form.get('Longitude')
            lat = request.form.get('Latitude')

            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute("""
                INSERT INTO parkinglotdata(
                    name, 
                    address, 
                    landmark, 
                    openingTime, 
                    closingTime, 
                    spaceInOut, 
                    price, 
                    widthLimit, 
                    heightLimit, 
                    lng, 
                    lat
                ) 
                VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (name, address, near_landmark, opening_time_am, opening_time_pm, 
                  space, price, car_width, car_height, lng, lat))
            connection.commit()
            
            parking_lot_images = request.files.getlist('img')
            parkinglotdata_id = cursor.lastrowid
            for image in parking_lot_images:
                if image and image.filename.endswith(('jpg', 'jpeg', 'png', 'jfif')):
                    filename = secure_filename(image.filename)
                    key = f"{str(int(time.time()))}-{filename}" # 生成檔案名稱
                    s3_client.upload_fileobj(image, BUCKET_NAME, key)
                    image_url = f"https://d1hxt3hn1q2xo2.cloudfront.net/{key}"
                    # print(image_url)
                    # 将 image_url 和 parkinglotdata_id 保存到数据库
                    insert_query = """
                        INSERT INTO parkinglotimage (parkinglotdata, image)
                        VALUES (%s, %s);
                    """
                    cursor.execute(insert_query, (parkinglotdata_id, image_url))
            connection.commit()


            all_text_data = request.form.to_dict()
            # print(all_text_data)
            for key, value in all_text_data.items():
                if key.startswith("parkingSquareNumber"):
                    insert_query = """
                            INSERT INTO parkinglotspace (parkinglotdata, number)
                            VALUES (%s, %s);
                        """
                    cursor.execute(insert_query, (parkinglotdata_id, value))
            connection.commit()  

            # all_image_files = request.files.to_dict()
            for key, image in request.files.items():
                if key.startswith("parkingSquareImage") and image:
                    # 使用正則表達式提取數字
                    match = re.search(r'parkingSquareImage(\d+)', key)
                    parkinglotspace = int(match.group(1)) if match else 1

                    filename = secure_filename(image.filename)
                    key = f"{str(int(time.time()))}-{filename}"
                    
                    # 假設 s3_client 已經被正確初始化
                    s3_client.upload_fileobj(image, BUCKET_NAME, key)
                    image_url = f"https://d1hxt3hn1q2xo2.cloudfront.net/{key}"
                    print(image_url)
                    
                    # 假設 cursor 已經被正確初始化
                    insert_query = """
                        INSERT INTO parkingspaceimage (parkinglotspace, image)
                        VALUES (%s, %s);
                    """
                    cursor.execute(insert_query, (parkinglotspace, image_url))
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
    
    if request.method == "GET":
        try:
            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)
            # 获取基本的停车场数据
            sql_query = (
                "SELECT id, name, landmark, address, openingTime, closingTime, "
                "spaceInOut, price, lat, lng, widthLimit, heightLimit "
                "FROM parkinglotdata"
            )
            cursor.execute(sql_query)
            parking_lot_datas = cursor.fetchall()

            # 为每个停车场获取图像和空间信息
            for parking_lot_data in parking_lot_datas:
                # 获取图像
                cursor.execute("SELECT image FROM parkinglotimage WHERE parkinglotdata = %s", (parking_lot_data["id"],))
                images = cursor.fetchall()
                parking_lot_data["images"] = [image["image"] for image in images]
                
                # 获取空间信息
                cursor.execute("SELECT id, number, status FROM parkinglotspace WHERE parkinglotdata = %s", (parking_lot_data["id"],))
                spaces = cursor.fetchall()
                parking_lot_data["spaces"] = [{"id": space["id"], "number": space["number"], "status": space["status"]} for space in spaces]
                print(spaces)
            cursor.close()
            connection.close()

            return_data = {
                "data": parking_lot_datas
            }
            return jsonify(return_data), 200
        except mysql.connector.Error as e:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
            return jsonify({"error": True, "message": "databaseError"}), 500