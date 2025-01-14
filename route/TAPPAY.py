from flask import *
from module.MYSQL import *
from module.JWT import *
import os, requests, traceback

tappay = Blueprint('TAPPAY', __name__)


@tappay.route("/api/pay", methods=["POST"])

def api_pay():
    try:
        connection = con.get_connection()
        cursor = connection.cursor(dictionary=True)
        connection.start_transaction()

        auth_header = request.headers.get('Authorization')
        if auth_header:
            payload = get_payload(auth_header)
            member_id = payload['member_id']
        else:
            return ({"error": True,"message": "please sign in"}), 403
        
        data = request.json
        prime = data["prime"]
        deposit = data["deposit"]
        # print(deposit)
        if not deposit:
            return jsonify({"error": True,"message": "deposit data lost"}), 400
        elif deposit == 0:
            return jsonify({"error": True,"message": "請輸入金額"}), 400
        else:
            # order_number = datetime.utcnow().strftime('%Y%m%d%H%M%S%f')
            order_number = datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S%f')
            # print(order_number)
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
        deposit_account_id = get_deposit_account_id(cursor, member_id)
        print(deposit_account_id)
        depositting(cursor, order_number, deposit_account_id['id'], deposit)
        headers = {'content-type': 'application/json',
                   "x-api-key": os.getenv('PARTNER_KEY')}
        response = requests.post('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime',
                                 data=json.dumps(payload), headers=headers)
        response_json = response.json()
        # print(response_json)
        if response_json["status"] == 0:
            deposit_status_change(cursor, order_number, deposit_account_id['id'])
            deposit_account_balance_change(cursor, deposit, member_id)
            connection.commit()
            return jsonify({
				"data": {
					"number": response_json['order_number'],
					"payment": {
					"status": "已付款",
					"message": "付款成功"
					}
				}
			}), 200
        else:
            return jsonify({
				"data": {
					"number": response_json['order_number'],
					"payment": {
					"status": "未付款",
					"message": "付款失敗"
					}
				}
			}), 200
    except mysql.connector.Error as e:
        traceback.print_exc()
        print("Database Error", e)
        if connection and connection.is_connected():
            connection.rollback()
        return jsonify({"error": True, "message": "Database Error"}), 500
    except Exception as e:
        traceback.print_exc()
        print("Internal Server Error", e)
        if connection and connection.is_connected():
            connection.rollback()
        return jsonify({"error": True, "message": "Internal Server Error"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
