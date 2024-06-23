import sqlite3
from flask import Flask, jsonify
from argparse import ArgumentParser

DB = 'figurines.sqlite'


def get_row_as_dict(row):
    row_dict = {
        'product_name': row[0],
        'product_description': row[1],
        'series': row[2],
        'manufacturer': row[3],
        'category': row[4],
        'tab_category': row[5],
        'price': row[6],
        'specification': row[7],
        'sculptor': row[8],
        'cooperation': row[9],
        'image1': row[10],
        'image2': row[11],
        'image3': row[12],
        'image4': row[13],
    }
    return row_dict


app = Flask(__name__)


@app.route('/api/figurines', methods=['GET'])
def index():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT product_name, product_description, series, manufacturer, category, tab_category, price, specification, sculptor, cooperation, image1, image2, image3, image4 FROM figurines;')

    rows = cursor.fetchall()
    db.close()

    rows_as_dict = [get_row_as_dict(row) for row in rows]
    return jsonify(rows_as_dict), 200


@app.route('/api/figurines/<int:figure>', methods=['GET'])
def show(figure):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT product_name, product_description, series, manufacturer, category, tab_category, price, specification, sculptor, cooperation, image1, image2, image3, image4 FROM figurines WHERE id=?', (figure,))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)
