from flask import *
from dotenv import load_dotenv
import os, jwt
from datetime import datetime, timedelta, timezone
from jwt import ExpiredSignatureError

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

def create_token(user_datas):
    payload = {
        'id': user_datas['id'],
        'account': user_datas['account'],
        'email': user_datas['email'],
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def decode_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError as e:
        print(e,'Token has expired')
        return False
    except jwt.InvalidTokenError as e:
        print(e,'Invalid token')
        return False
    
def get_payload(auth_header):
    token = auth_header.split(' ')[1]
    payload = decode_token(token)
    user_id = payload['id']
    user_account = payload['account']
    user_email = payload['email']
    return {'member_id':user_id, 'member_account': user_account, 'member_email': user_email}