from flask import Flask, jsonify, request
from data import parse_csv

app = Flask(__name__)

@app.route('/get/<query>/<value>', methods=['GET'])
def hello(query, value):
    result = parse_csv('emissions.csv', {query: value})
    return jsonify(result), 200

@app.route('/echo', methods=['POST'])
def echo():
    data = request.json
    return jsonify(data), 200

if __name__ == '__main__':
    app.run(debug=True)