from flask import *
from module.JWT import *
import os, requests, traceback

get_Lat_and_long = Blueprint('get_Lat_and_Long', __name__)

@get_Lat_and_long.route("/api/get_Lat_and_Long", methods=["POST"])

def api_get_Lat_and_Long():
    try:
        auther_header = request.headers.get('Authorization')

        if not auther_header:
            return jsonify({"error": True, 'message': 'please sign in'}), 403
        # Google API 密鑰
        API_KEY = os.getenv('GOOGLE_MAP_APIKEY')
        data = request.json
        address = data
        if not address:
            return jsonify({"error": True, 'message': 'address lost'}), 403
        url = f'https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={API_KEY}'
        #get 經緯度資訊
        response = requests.get(url)
        if response:
            response_json = response.json()
            return jsonify(response_json['results'][0]['geometry']['location']), 200

    except Exception as e:
        traceback.print_exc()
        print("Internal Server Error", e)
        return jsonify({"error": True, "message": "Internal Server Error"}), 500