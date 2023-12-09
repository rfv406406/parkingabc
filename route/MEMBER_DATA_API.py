from flask import *
from module.MYSQL import *
from module.JWT import *
from datetime import datetime

member_data = Blueprint('MEMBER_DATA_API', __name__)

@member_data.route("/api/get_member_data", methods = ["GET"])

def get_member_data():
    try:
        auth_header = request.headers.get('Authorization')
        # print(auth_header)
        if auth_header is None:
            return ({"error": True,"message": "please sign in"}), 403
        else:
            token = auth_header.split(' ')[1]
            payload = decode_token(token)
            member_id = payload['id']

        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        # 获取基本的停车场数据
        sql_query = '''
                    SELECT 
                        member.status,
                        deposit_account.Balance
                    FROM 
                        member
                    JOIN 
                        deposit_account ON member.id = deposit_account.member_id
                    WHERE
                        member.id = %s;
                    '''
        cursor.execute(sql_query, (member_id,))
        member_data = cursor.fetchall()
       
        cursor.close()
        connection.close()
        if member_data:
            return_data = {
                "data": member_data
            }
        else:
            return_data = {
                "data": "目前尚無停車資訊"
            }
        return jsonify(return_data), 200
    except mysql.connector.Error as e:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return jsonify({"error": True, "message": "databaseError"}), 500