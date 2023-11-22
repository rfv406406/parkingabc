from flask import *
from dotenv import load_dotenv
import os
load_dotenv()

import mysql.connector
from mysql.connector import pooling
config = {
    "host":os.getenv('HOST'),
    "user":os.getenv('USER'),
    "password":os.getenv('PASSWORD'),
    "database":os.getenv('DATABASE'),
    # "host":"db-stage3-week1.cxzjwrl3yccb.us-east-1.rds.amazonaws.com",
    # "port":3306,
    # "user":"root",
    # "password":"12345678",
    # "database":"Stage3",
}
con =  pooling.MySQLConnectionPool(pool_name = "mypool",
                              pool_size = 10,
                              **config)