from flask import *
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import os, boto3, time , re, uuid, time

load_dotenv()

app=Flask(__name__)

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

import mysql.connector
from mysql.connector import pooling
config = {
    "host":os.getenv('HOST'),
    "user":os.getenv('USER'),
    "password":os.getenv('PASSWORD'),
    "database":os.getenv('DATABASE'),
    # "host":"db-stage3-week1.cxzjwrl3yccb.us-east-1.rds.amazonaws.com",
    # "port":3306,
    # "user":"root",
    # "password":"12345678",
    # "database":"Stage3",
}
con =  pooling.MySQLConnectionPool(pool_name = "mypool",
                              pool_size = 10,
                              **config)

# 從環境變數中取得 AWS 設定
ACCESS_KEY = os.getenv('ACCESS_KEY')
SECRET_ACCESS_KEY = os.getenv('SECRET_ACCESS_KEY')
S3_BUCKET_REGION = os.getenv('S3_BUCKET_REGION')
BUCKET_NAME = os.getenv('BUCKET_NAME')

# 建立新的 S3 用戶端實例，設定區域和認證資訊
s3_client = boto3.client('s3', 
                        region_name = S3_BUCKET_REGION,
                        aws_access_key_id = ACCESS_KEY,
                        aws_secret_access_key = SECRET_ACCESS_KEY) 

@app.route("/")
def index():
    return render_template("parking_lot_page.html")

@app.route("/api/input_parking_lot_information", methods = ["GET","POST"])

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
            lng = request.form.get('lng')
            lat = request.form.get('lat')

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
            """, (name, address, near_landmark, opening_time_am, opening_time_pm, space, price, car_width, car_height, lng, lat))
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
            cursor.execute("SELECT * FROM messages")
            data = cursor.fetchall()
            cursor.close()
            connection.close()
            print(data)
            return_data = {
                "data":data
            }
            return jsonify(return_data), 200
        except mysql.connector.Error:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
            return jsonify({"error": True,"message": "databaseError"}), 500
        
app.run(debug=True, host="0.0.0.0", port=4000)