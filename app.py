from flask import Flask, request, jsonify
import os
from werkzeug.urls import url_quote
app = Flask(__name__)

@app.route('/')
def home():
    return "Wound Area Estimator Backend"

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({"error": "No image file"}), 400
    file = request.files['image']

    wound_area = "100"  
    file_name = f"wound_area_{wound_area}.jpg"
    file.save(os.path.join("/tmp", file_name))
    return jsonify({"filename": file_name, "wound_area": wound_area})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
