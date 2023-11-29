from flask import *
from module.MYSQL import *
from module.JWT import *

sign_system = Blueprint('SIGN_SYSTEM', __name__)


@sign_system.route("/api/user", methods = ["POST"])

def user():
    try:
        data = request.json
        account = data["signupAccount"]
        email = data["signupEmail"]
        password = data["signupPassword"]
        print(data)
        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT email FROM member WHERE email= %s", (email, ))
        data = cursor.fetchone()
        print(data)
        if data is None:
            cursor.execute("INSERT INTO member(account, email, password) VALUES(%s, %s, %s)", (account, email, password))
            connection.commit()
            member_id = cursor.lastrowid
            cursor.execute("INSERT INTO deposit_account(member_id) VALUES(%s)", (member_id, ))
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

@sign_system.route("/api/user/auth", methods=["GET","PUT"])

def user_auth():
    if request.method == "PUT":
        try:
            data = request.json
            account = data["account"]
            password = data["password"]

            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT id, account, email FROM member WHERE account= %s AND password=%s", (account, password))
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
            user_account = payload.get('account')
            user_email = payload.get('email')

            return jsonify({"data":{'id': user_id, 'account': user_account, 'email': user_email}}), 200
        except ExpiredSignatureError:
            return ({"error": True, "message": "Token is expired"}),401
        except Exception:
            return jsonify(None), 400