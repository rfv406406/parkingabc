from flask import Blueprint,jsonify,request
from module.MYSQL import *
from module.JWT import *

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

        data = request.get_json()
       
        prime = data["prime"]
        deposit = data["totalPrice"]
    
        if not deposit or deposit == 0:
            return jsonify({"error": True,"message": "請輸入金額"}), 400
        else:
            order_number = datetime.utcnow().strftime('%Y%m%d%H%M%S%f')
            payload = {
                "prime": data["prime"],
                "partner_key": os.getenv('PARTNER_KEY'),
                "merchant_id": "rfv406406_CTBC",
                "details": "TapPay Test",
                "amount": data["deposit"],
                "order_number": order_number,
                "remember": True
            }
        cursor.execute("""
        INSERT INTO transactions(
                deposit_account_id, order_number, Type, Amount, status
            ) 
            VALUES(%s, %s, %s, %s)
        """, (deposit_account_id, order_number, 'DEPOSIT', deposit, '未繳款'))
        connection.commit()
        cursor.close()
        connection.close()
   
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
                            WHERE order_number = %s
                        """, ('已繳款', order_number))
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
    
# @tappay.route("/api/orders/<orderNumber>", methods=['GET'])
# def orders_get(orderNumber):
 
#     auth_header = request.headers.get('Authorization')
#     # print(auth_header)
#     if not auth_header:
#         return ({"error": True,"message": "please sign in"}), 403
#     token = auth_header.split(' ')[1]
#     payload = decode_token(token)
#     if not payload:
#         return ({"error": True,"message": "please sign in"}), 403
    
#     connection = con.get_connection()
#     cursor = connection.cursor(dictionary=True)

#     cursor.execute("SELECT * FROM ordering WHERE order_number = %s",(orderNumber,))
#     data = cursor.fetchone()
#     # print(data)
#     cursor.close()
#     connection.close()
#     if data:
#         order_info = {
#             'data':{
#             "number": data["order_number"],
#             "price": data["price"],
#             "trip": {
#                 "attraction": {
#                     "id": data["attraction_id"],
#                     "name": data["attraction_name"],
#                     "address": data["attraction_address"],
#                 },
#                 "date": data["date"],
#                 "time": data["time"],
#             },
#             "contact": {
#                 "name": data["connection_name"],
#                 "email":data["connection_email"],
#                 "phone": data["phone_number"]
#             },
#             "status": data["status"]
#         }}

#     return jsonify(order_info), 200