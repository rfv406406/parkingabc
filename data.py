from flask import Blueprint,jsonify,request
from module.MYSQL import *
from module.JWT import *
from module.S3 import *
from werkzeug.utils import secure_filename
from pyproj import Proj, transform
import time, re, csv, io, random, json

# 路徑定義
NTC_PARKING_path = 'parkingabc/data/NTCMSV.csv'
TC_PARKING_path = "parkingabc/data/TCMSV.json"

# 定義投影
proj_twd97 = Proj(init='epsg:3826')
proj_wgs84 = Proj(init='epsg:4326')

# 連接資料庫
connection = con.get_connection()  # 假設 con 是一個資料庫連接對象
cursor = connection.cursor()

# 處理 CSV 檔案
with open(NTC_PARKING_path, "r", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    next(reader, None)  # 跳過首行

    count = 0
    for row in reader:
        count += 1
        if count > 50:
            break
 
        # 提取 CSV 數據
        name = row["NAME"]
        address = row["ADDRESS"]
        phone = row["TEL"]
        TW97X = float(row["TW97X"])
        TW97Y = float(row["TW97Y"])
        lon, lat = transform(proj_twd97, proj_wgs84, TW97X, TW97Y)
        # 四舍五入到小数点后七位
        lon = round(lon, 7)
        lat = round(lat, 7)
        price = random.choice([20, 45, 65])

        # 插入數據到資料庫
        sql = """
        INSERT INTO parkinglotdata (member_id, name, address, landmark, openingTime, closingTime, spaceInOut, price, widthLimit, heightLimit, lng, lat) 
        VALUES (1, %s, %s, '無', '00:00', '24:00', '室內', %s, 2, 2, %s, %s)
        """
        cursor.execute(sql, (name, address, price, lon, lat))

        parkinglotdata_id = cursor.lastrowid

        # 為 parkinglotdata_id 生成隨機 1 到 3 筆 square_number 數據
        for i in range(1, random.randint(2, 4)):
            insert_query = """
                INSERT INTO parkinglotsquare (parkinglotdata_id, square_number)
                VALUES (%s, %s);
            """
            cursor.execute(insert_query, (parkinglotdata_id, i))

# 處理 JSON 檔案
with open(TC_PARKING_path, 'r', encoding='utf-8') as file:
    data = json.load(file)
    count = 0
    for park in data['data']['park']:
        count += 1
        if count > 50:
            break
        # 提取 JSON 數據
        name = park['name']
        address = park['address']
        phone = park['tel']
        TW97X = float(park['tw97x'])
        TW97Y = float(park['tw97y'])
        lon, lat = transform(proj_twd97, proj_wgs84, TW97X, TW97Y)
        # 四舍五入到小数点后七位
        lon = round(lon, 7)
        lat = round(lat, 7)
        price = random.choice([20, 45, 65])

        # 插入數據到資料庫
        sql = """
        INSERT INTO parkinglotdata (member_id, name, address, landmark, openingTime, closingTime, spaceInOut, price, widthLimit, heightLimit, lng, lat) 
        VALUES (1, %s, %s, '無', '00:00', '24:00', '室內', %s, 2, 2, %s, %s)
        """
        cursor.execute(sql, (name, address, price, lon, lat))

        parkinglotdata_id = cursor.lastrowid

        # 為 parkinglotdata_id 生成隨機 1 到 3 筆 square_number 數據
        for i in range(1, random.randint(2, 4)):
            insert_query = """
                INSERT INTO parkinglotsquare (parkinglotdata_id, square_number)
                VALUES (%s, %s);
            """
            cursor.execute(insert_query, (parkinglotdata_id, i))

# 提交事務
connection.commit()

# 關閉游標和連接
cursor.close()
connection.close()