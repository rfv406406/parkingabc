from flask import *
from module.MYSQL import *
from module.JWT import *
import mysql.connector

sign_system = Blueprint('SIGN_SYSTEM', __name__)


@sign_system.route("/api/user", methods = ["POST"])

def user():
    try:
        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        connection.start_transaction()

        data = request.json
        if not data:
            return jsonify({"error": True,"message": "NO DATA PROVIDED"}), 400
        user_email = get_user_email(cursor, data)
        if user_email:
            return jsonify({"error": True,"message": "Email已經註冊帳戶"}), 400
        
        member_id = user_infor_input_database(cursor, data)
        create_deposit_account(cursor, member_id)  
        connection.commit()
        response = make_response(jsonify({"ok": True}), 200)
        response.set_cookie('RegistrationCompleted', 'TRUE', max_age=60*5, path='/')  # Cookie 有效期5分钟
        return response
            
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

@sign_system.route("/api/user/auth", methods=["GET","PUT"])

def user_auth():
    if request.method == "PUT":
        try:
            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)
            data = request.json
            user_datas = get_user_account_datas(cursor, data)
            if user_datas:
                token = create_token(user_datas)
                return jsonify({'token': token}), 200
            else:
                return jsonify({"error": True,"message": "帳號或密碼錯誤"}), 400
                    
        except mysql.connector.Error as e:
            print("Database Error", e)
            return jsonify({"error": True, "message": "Database Error"}), 500
        except Exception as e:
            print("Error", e)
            return jsonify({"error": True, "message": e}), 500
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
                   
    if request.method == "GET":
        try:
            auth_header = request.headers.get('Authorization')
            if auth_header:
                data = get_payload(auth_header)
                return jsonify({"data":{'id': data['member_id'], 'account': data['member_account'], 'email': data['member_email']}}), 200
            else:
                print('No Authorization')
                return ({"error": True,"message": "please sign in"}), 403
        except ExpiredSignatureError as e:
            print('ExpiredSignatureError', e)
            return ({"error": True, "message": "Token is expired"}),401
        except Exception as e:
            print('Error', e)
            return jsonify({'error': True, 'message': 'Error'}), 500