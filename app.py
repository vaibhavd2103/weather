from flask import Flask, jsonify, send_file
from flask_cors import CORS, cross_origin
import pandas as pd

app = Flask(__name__)
cors = CORS(app, headers='Content-Type', origins='http://localhost:3000')
data = pd.read_csv('london_weather.csv')
# print(data.columns)

# Convert the date column to datetime format and extract the year
data['date'] = pd.to_datetime(data['date'], format='%Y%m%d', errors='coerce')
data['year'] = data['date'].dt.year

# Heath check endpoint
@app.route('/', methods=['GET'])
def emptyFunc():
    return "Health check successful!"

# Get all available years
@app.route('/getAllYears', methods=['GET'])
def get_years():
    print(data['year'].unique().tolist())
    return jsonify(data['year'].unique().tolist())

# Get weather data for a specific year
@app.route('/weatherData/<int:year>', methods=['GET'])
def get_yearly_data(year):
    yearly_data = data[data['year'] == year]
    return yearly_data.to_json(orient='records')

# Download weather data for a specific year as CSV
@app.route('/download/<int:year>', methods=['GET'])
def download_yearly_data(year):
    yearly_data = data[data['year'] == year]
    print(yearly_data.head())
    yearly_data.to_csv(f'{year}_data.csv', index=False)
    return send_file(f'{year}_data.csv', as_attachment=True)
