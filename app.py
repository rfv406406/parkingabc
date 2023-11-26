from flask import *
# import os, boto3, time , re, uuid

from route.BOOKING import booking
from route.INPUT_PARKING_LOT import input_parking_lot
from route.SIGN_SYSTEM import sign_system
from route.STOP_PARKING import check_out
from route.TAPPAY import tappay

app=Flask(__name__)

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

app.register_blueprint(booking)
app.register_blueprint(input_parking_lot)
app.register_blueprint(sign_system)
app.register_blueprint(check_out)
app.register_blueprint(tappay)

@app.route("/")
def index():
    return render_template("index.html")
@app.route("/id")
def id():
    return render_template("id.html")
@app.route("/parkinglotpage")
def parking_lot_page():
    return render_template("parking_lot_page.html")
@app.route("/selector")
def selector():
    return render_template("selector.html")
@app.route("/car_page")
def car_page():
    return render_template("car_page.html")
@app.route("/deposit_and_pay_page")
def deposit_and_pay_page():
    return render_template("deposit_and_pay_page.html")

app.run(debug=True, host="0.0.0.0", port=5000)