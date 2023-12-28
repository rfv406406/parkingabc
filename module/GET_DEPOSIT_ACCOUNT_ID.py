from flask import *
from module.MYSQL import *

def get_deposit_account_id(member_id):
    connection = con.get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT id FROM deposit_account WHERE member_id = %s", (member_id,))
    result = cursor.fetchone()

    cursor.close()
    connection.close()

    if result:
        return result[0]
    else:
        return None