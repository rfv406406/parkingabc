from flask import *
from module.MYSQL import *
from module.JWT import *

id_data = Blueprint('GET_ID_PAGE_DATA', __name__)

@id_data.route("/api/get_id_page_data", methods = ["GET"])

def get_id_page_data():
    try:
        auth_header = request.headers.get('Authorization')
        # print(auth_header)
        if auth_header is None:
            return ({"error": True,"message": "please sign in"}), 403
        else:
            token = auth_header.split(' ')[1]
            payload = decode_token(token)
            member_id = payload.get('id')

        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
   
        sql_query = '''
                    SELECT
                        id,
                        name,
                        birthday,
                        cellphone,
                        email,
                        account,
                        status,
                        RegistrationDate
                    FROM
                        member
                    WHERE
                        id = %s;
                    '''
        cursor.execute(sql_query, (member_id,))
        id_data = cursor.fetchone()
       
        cursor.close()
        connection.close()

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
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return jsonify({"error": True, "message": "databaseError"}), 500

@id_data.route("/api/input_id_page_data", methods = ["POST"])

def input_booking_information():
    try:
        auth_header = request.headers.get('Authorization')
     
        if auth_header is None:
            return ({"error": True,"message": "please sign in"}), 403
        else:
            token = auth_header.split(' ')[1]
            payload = decode_token(token)
            member_id = payload.get('id')

        data = request.json
        
        if not data:
            return ({"error": True,"message": "data is not existed"}), 400

        name = data.get('name')
        email = data.get('email')
        birthday = data.get('birthday')
        cellphone = data.get('cellphone')
        password = data.get('password')

        # 初始化 SQL 語句和參數列表
        sql_query = "UPDATE member SET "
        params = []

        # 為每個非空的欄位添加 SQL 語句和參數
        if name:
            sql_query += "name = %s, "
            params.append(name)

        if email:
            sql_query += "email = %s, "
            params.append(email)

        if birthday:
            sql_query += "birthday = %s, "
            params.append(birthday)

        if cellphone:
            sql_query += "cellphone = %s, "
            params.append(cellphone)

        if password:
            sql_query += "password = %s, "
            params.append(password)

        # 去掉最後的逗號並添加 WHERE 子句
        sql_query = sql_query.rstrip(', ') + " WHERE id = %s"
        params.append(member_id)

        # 執行 SQL 語句
        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(sql_query, tuple(params))
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