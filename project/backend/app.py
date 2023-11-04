from flask import Flask, jsonify, request
from data import parse_csv
from chat import get_response
import datetime

app = Flask(__name__)

@app.route('/get/<query>/<value>', methods=['GET'])
def hello(query, value):
    result = parse_csv('emissions.csv', {query: value})
    return jsonify(result), 200


@app.route('/info/<name>', methods=['GET'])
def info(name):
    now = datetime.datetime.now()
    ret = {
        'result' : get_response(name),
    }
    elapsed = f"{round((datetime.datetime.now() - now).total_seconds())} seconds"
    ret['time'] = elapsed
    return jsonify(ret), 200

@app.route('/echo', methods=['POST'])
def echo():
    data = request.json
    return jsonify(data), 200

if __name__ == '__main__':
    app.run(debug=True)