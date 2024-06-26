from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import joblib
from PIL import Image
import numpy as np

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './uploads'
MODEL_PATH = 'wound_area_model.pkl'

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Load the ML model
# model = joblib.load(MODEL_PATH)  # Uncomment if you have a model

def preprocess_image(image_path):
    image = Image.open(image_path)
    image = image.resize((128, 128))
    image = np.array(image) / 255.0
    image = image.reshape(1, -1)
    return image

@app.route('/api/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files['image']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Preprocess the image
    processed_image = preprocess_image(file_path)

    # Predict using the loaded model
    # prediction = model.predict(processed_image)  # Uncomment if you have a model
    # area = prediction[0]  # Assuming the model predicts a single value
    area = 42  # Placeholder value

    new_file_name = f"{os.path.splitext(file.filename)[0]}_area_{area}{os.path.splitext(file.filename)[1]}"
    new_file_path = os.path.join(UPLOAD_FOLDER, new_file_name)
    os.rename(file_path, new_file_path)

    return jsonify({"message": "Image uploaded successfully", "area": area, "file_path": new_file_path}), 200


def handler(request, response):
    with app.request_context(request.environ):
        response.data = app.full_dispatch_request().data
        response.status_code = app.response_class.status_code

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
