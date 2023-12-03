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
            auth_header = request.headers.get('Authorization')
            # print(auth_header)
            if auth_header is None:
                return ({"error": True,"message": "please sign in"}), 403
            else:
                token = auth_header.split(' ')[1]
                payload = decode_token(token)
                member_id = payload.get('id')
            
            if not request.form:
                return ({"error": True,"message": "data is not existed"}), 400
            
            boardNumber = request.form.get('boardNumber')
            # 更新停車時間
            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute("""
                INSERT INTO car (member_id, carboard_unmber)
                VALUES (%s, %s);
            """, (member_id, boardNumber))
            connection.commit()
            car_images = request.files.getlist('img')
            car_id = cursor.lastrowid
            for image in car_images:
                if image and image.filename.endswith(('jpg', 'jpeg', 'png', 'jfif')):
                    filename = secure_filename(image.filename)
                    key = f"{str(int(time.time()))}-{filename}" # 生成檔案名稱
                    s3_client.upload_fileobj(image, BUCKET_NAME, key)
                    image_url = f"https://d1hxt3hn1q2xo2.cloudfront.net/{key}"
                    # print(image_url)
                    # 将 image_url 和 parkinglotdata_id 保存到数据库
                    insert_query = """
                        INSERT INTO car_image (car_id, car_image)
                        VALUES (%s, %s);
                    """
                    cursor.execute(insert_query, (car_id, image_url))
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
            cursor.execute("SELECT * FROM car WHERE member_id = %s", (member_id,))
            carboard_number_datas = cursor.fetchall()

            for carboard_number_data in carboard_number_datas:
                # 获取图像
                cursor.execute("SELECT car_image FROM car_image WHERE car_id = %s", (carboard_number_data["id"],))
                images = cursor.fetchall()
                carboard_number_data["images"] = [image["car_image"] for image in images]
                
            cursor.close()
            connection.close()
            print(carboard_number_datas)
            if carboard_number_datas is not None:  # Check if parking_lot_datas is not None
                return_data = {
                    "data": carboard_number_datas
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
            car_id = data.get('id')  # 从请求中获取停车场数据的ID

            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)

            cursor.execute("DELETE FROM car_image WHERE car_id = %s", (car_id,))

            # 最后删除 parkinglotdata 本身
            cursor.execute("DELETE FROM car WHERE id = %s AND member_id = %s", (car_id, member_id))

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