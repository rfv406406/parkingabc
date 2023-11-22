from flask import *
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from datetime import datetime
import os, boto3, time , re, uuid, time
from module.JWT import create_token, decode_token
from module.MYSQL import *
load_dotenv()

app=Flask(__name__)

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

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
    return render_template("index.html")
@app.route("/id")
def id():
    return render_template("id.html")
@app.route("/parkinglotpage")
def parking_lot_page():
    return render_template("parking_lot_page.html")
@app.route("/selector")
def selector():
    return render_template("selector.html")
@app.route("/car_page")
def car_page():
    return render_template("car_page.html")

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

@app.route("/api/input_booking_information", methods = ["POST"])

def input_booking_information():
    try:
        data = request.get_json()
        bookingData = data.get('bookingData')
        bookingTime = data.get('bookingTime')

        parking_lot_id = bookingData.get('id')
        parking_lot_name = bookingData.get('name')
        parking_lot_address = bookingData.get('address')
        parking_lot_price = bookingData.get('price')
        parking_lot_space_obj = bookingData.get('spaces')[0]
        parking_lot_space_id = parking_lot_space_obj.get('id')
        parking_lot_space_name = parking_lot_space_obj.get('number')
        

        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            INSERT INTO income(
                parkinglot, 
                parkinglotname, 
                parkinglotspace, 
                parkinglotspacename, 
                starttime,
                address,
                price
            ) 
            VALUES(%s, %s, %s, %s, %s, %s, %s)
        """, (parking_lot_id, parking_lot_name, parking_lot_space_id, 
            parking_lot_space_name, bookingTime, parking_lot_address, parking_lot_price))
        # 更新 parkinglotspace 表中的 status
        cursor.execute("""
            UPDATE parkinglotspace
            SET status = '使用中'
            WHERE id = %s
        """, (parking_lot_space_id,))

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

@app.route("/api/get_booking_information", methods = ["GET"])

def get_booking_information():
    try:
        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        # 获取基本的停车场数据
        sql_query = (
            "SELECT id, date, parkinglot, parkinglotname, parkinglotspace, "
            "parkinglotspacename, address, price, starttime, stoptime, income "
            "FROM income"
        )
        cursor.execute(sql_query)
        booking_information_data = cursor.fetchall()

        cursor.close()
        connection.close()

        return_data = {
            "data": booking_information_data
        }
        return jsonify(return_data), 200
    except mysql.connector.Error as e:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return jsonify({"error": True, "message": "databaseError"}), 500
         
@app.route("/api/input_stopping_data", methods = ["POST"])

def input_stopping_data():
    try:
        data = request.get_json()
        stoppingDataId = data.get('stopData')
        stoppingTime = data.get('stopTime')

        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            UPDATE income
            SET stoptime = %s
            WHERE id = %s
        """, (stoppingTime, stoppingDataId))

        cursor.execute("""
            SELECT starttime, price, parkinglot, parkinglotspacename
            FROM income
            WHERE id = %s
        """, (stoppingDataId,))
        row = cursor.fetchone()
        if row:
            starttime = row['starttime']
            price_per_hour = row['price']
            parkinglot = row['parkinglot']
            parkinglotspacename = row['parkinglotspacename']
        
         # 计算总时间（小时）
        total_hours = (datetime.strptime(stoppingTime, '%Y-%m-%d %H:%M:%S') - 
                    datetime.strptime(starttime, '%Y-%m-%d %H:%M:%S')).total_seconds() / 3600

        total_hours = float(total_hours)  # 转换为浮点数
        price_per_hour = float(price_per_hour)  # 同样转换为浮点数
        # 计算总费用
        total_cost = total_hours * price_per_hour
        cursor.execute("""
            UPDATE income
            SET income = %s
            WHERE id = %s
        """, (total_cost, stoppingDataId))

        cursor.execute("""
            UPDATE parkinglotspace
            SET status = NULL
            WHERE parkinglotdata = %s AND number = %s
        """, (parkinglot, parkinglotspacename))

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

@app.route("/api/user", methods = ["POST"])

def user():
    try:
        data = request.json
        account = data["signupName"]
        email = data["signupEmail"]
        password = data["signupPassword"]

        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT email FROM member WHERE email= %s", (email, ))
        data = cursor.fetchone()

        if data is None:
            cursor.execute("INSERT INTO member(account, email, password) VALUES(%s, %s, %s)", (account, email, password))
            connection.commit()
            cursor.close()
            connection.close()
            return jsonify({"ok":True}), 200
        else:
            cursor.close()
            connection.close()
            return jsonify({"error": True,"message": "Email已經註冊帳戶"}), 400
    except mysql.connector.Error:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return jsonify({"error": True,"message": "databaseError"}), 500

@app.route("/api/user/auth", methods=["GET","PUT"])

def user_auth():
    if request.method == "PUT":
        try:
            data = request.json
            email = data["account"]
            password = data["password"]

            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT id, name, email FROM member WHERE email= %s AND password=%s", (email, password))
            data = cursor.fetchone()

            if data is None:
                cursor.close()
                connection.close()
                return jsonify({"error": True,"message": "帳號或密碼錯誤"}), 400
            else:
                cursor.close()
                connection.close()
                token = create_token(data)
                return jsonify({'token': token}), 200
        except mysql.connector.Error:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
            return jsonify({"error": True,"message": "databaseError"}), 500
                   
    if request.method == "GET":
        try:
            auth_header = request.headers.get('Authorization')
            token = auth_header.split(' ')[1]
            payload = decode_token(token)
    
            user_id = payload.get('id')
            user_name = payload.get('name')
            user_email = payload.get('email')

            return jsonify({"data":{'id': user_id, 'name': user_name, 'email': user_email}}), 200
        except ExpiredSignatureError:
            return ({"error": True, "message": "Token is expired"}),401
        except Exception:
            return jsonify(None), 400
app.run(debug=True, host="0.0.0.0", port=5000)