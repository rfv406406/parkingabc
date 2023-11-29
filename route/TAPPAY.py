from flask import *
from module.MYSQL import *
from module.JWT import *
from module.GET_DEPOSIT_ACCOUNT_ID import *
import os, requests

tappay = Blueprint('TAPPAY', __name__)


@tappay.route("/api/pay", methods=["POST"])
def api_pay():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return ({"error": True,"message": "please signin"}), 403
        token = auth_header.split(' ')[1]
        payload = decode_token(token)
        member_id = payload.get('id')
        if not payload:
            return ({"error": True,"message": "please signin"}), 403
        
        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)

        data = request.json
       
        prime = data.get("prime")
        deposit = data.get("deposit")
        
        if not deposit or deposit == 0:
            return jsonify({"error": True,"message": "請輸入金額"}), 400
        else:
            order_number = datetime.utcnow().strftime('%Y%m%d%H%M%S%f')
            
            payload = {
                "prime": prime,
                "partner_key": os.getenv('PARTNER_KEY'),
                "merchant_id": "rfv406406_CTBC",
                "details": "TapPay Test",
                "amount": deposit,
                "order_number": order_number,
                "cardholder": {
                    "phone_number": "0987654321",
                    "name": "name",
                    "email": "email"
                },
                "remember": True
            }
            
        deposit_account_id = get_deposit_account_id(member_id)
        print(deposit_account_id)
        cursor.execute("""
        INSERT INTO transactions(
            order_number, deposit_account_id, Type, Amount, status
        ) 
        VALUES(%s, %s, %s, %s, %s)
        """, (order_number, deposit_account_id, 'DEPOSIT', deposit, '未繳款'))
        connection.commit()
        cursor.close()
        connection.close()
        print(deposit)
        headers = {'content-type': 'application/json',
                   "x-api-key": os.getenv('PARTNER_KEY')}
        response = requests.post('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime',
                                 data=json.dumps(payload), headers=headers)
        response_json = response.json()
        print(response_json)
        if response_json["status"] == 0:
            connection = con.get_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute("""
                            UPDATE transactions
                            SET status = %s
                            WHERE order_number = %s AND deposit_account_id = %s
                        """, ('已繳款', order_number, get_deposit_account_id(member_id)))
            connection.commit()
            cursor.execute("UPDATE deposit_account SET Balance = Balance + %s WHERE member_id = %s", (deposit, member_id))
            connection.commit()
            cursor.close()
            connection.close()
            return jsonify({
				"data": {
					"number": response_json['order_number'],
					"payment": {
					"status": "已付款",
					"message": "付款成功"
					}
				}
			}),200
        else:
            return jsonify({
				"data": {
					"number": response_json['order_number'],
					"payment": {
					"status": "未付款",
					"message": "付款失敗"
					}
				}
			}),200
    except Exception as e:
            return jsonify({"error": True,"message":f"Error occurred: {str(e)}"}), 500
    