from flask import Flask, jsonify, request
from data import parse_csv
from chat import get_response
import datetime
import os
from flask import Flask, render_template, send_from_directory

frontend_dir = os.path.abspath('../frontend/build')

app = Flask(__name__, static_folder=frontend_dir, static_url_path='')

# define a route for the root URL
@app.route('/', methods=['GET'])
def hello_world():
    # render the index.html template
    return send_from_directory(app.static_folder, 'index.html')
    #return render_template('index.html')

# define a route to get data based on a query and value
@app.route('/cumulative/<query>/<value>', methods=['GET'])
def cumulative(query, value):
    # parse the CSV and return the result as json
    result = parse_csv('emissions.csv', {query: value})
    return jsonify(result), 200

@app.route('/capita/<query>/<value>', methods=['GET'])
def capita(query, value):
    # parse the CSV and return the result as json
    result = parse_csv('capita.csv', {query: value})
    return jsonify(result), 200

# define a route to get information for a given name
@app.route('/info/<name>', methods=['GET'])
def info(name):
    # record the current time
    now = datetime.datetime.now()
    ret = {
        # get a response from the chat module
        'result' : get_response(name),
    }
    # calculate and append the elapsed time to the response
    elapsed = f"{round((datetime.datetime.now() - now).total_seconds())} seconds"
    ret['time'] = elapsed
    return jsonify(ret), 200

# define a route to echo back the posted data
@app.route('/echo', methods=['POST'])
def echo():
    # retrieve json data from the request
    data = request.json
    # return the data as json
    return jsonify(data), 200

# run the application when this file is called directly
if __name__ == '__main__':
    app.run(debug=True)