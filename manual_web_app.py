import pickle
import numpy as np
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Load models

with open('UAS/App/model/fish_SVM.pkl', 'rb') as file:
    fish_model_svm = pickle.load(file)
with open('UAS/App/model/pumpkin_SVM.pkl', 'rb') as file:
    pumpkin_model_svm = pickle.load(file)
with open('UAS/App/model/fruit_SVM.pkl', 'rb') as file:
    fruit_model_svm = pickle.load(file)
with open('UAS/App/model/fish_PCP.pkl', 'rb') as file:
    fish_model_pcp = pickle.load(file)
with open('UAS/App/model/pumpkin_PCP.pkl', 'rb') as file:
    pumpkin_model_pcp = pickle.load(file)
with open('UAS/App/model/fruit_PCP.pkl', 'rb') as file:
    fruit_model_pcp = pickle.load(file)
with open('UAS/App/model/fish_RF.pkl', 'rb') as file:
    fish_model_rf = pickle.load(file)
with open('UAS/App/model/pumpkin_RF.pkl', 'rb') as file:
    pumpkin_model_rf = pickle.load(file)
with open('UAS/App/model/fruit_RF.pkl', 'rb') as file:
    fruit_model_rf = pickle.load(file)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    prediction_type = data.get('type')
    algorithm = data.get('algorithm', 'svm')  # Default to SVM

    # Mapping algoritma ke model
    models = {
        'svm': {
            'fish': fish_model_svm,
            'pumpkin': pumpkin_model_svm,
            'fruit': fruit_model_svm,
        },
        'pcp': {
            'fish': fish_model_pcp,
            'pumpkin': pumpkin_model_pcp,
            'fruit': fruit_model_pcp,
        },
        'rf': {
            'fish': fish_model_rf,
            'pumpkin': pumpkin_model_rf,
            'fruit': fruit_model_rf,
        }
    }

    # Validasi algoritma dan tipe prediksi
    if algorithm not in models or prediction_type not in models[algorithm]:
        return jsonify({'error': 'Invalid algorithm or prediction type'}), 400

    model = models[algorithm][prediction_type]

    # Sesuaikan fitur berdasarkan tipe prediksi
    if prediction_type == 'fish':
        features = np.array([
            data['length'],
            data['weight'],
            data['wl_ratio']
        ]).reshape(1, -1)
    elif prediction_type == 'pumpkin':
        features = np.array([
            data['area'],
            data['perimeter'],
            data['major_axis'],
            data['minor_axis'],
            data['convex_area'],
            data['equiv_diameter'],
            data['eccentricity'],
            data['solidity'],
            data['extent'],
            data['roundness'],
            data['aspect_ratio'],
            data['compactness']
        ]).reshape(1, -1)
    elif prediction_type == 'fruit':
        features = np.array([
            data['diameter'],
            data['weight'],
            data['red'],
            data['green'],
            data['blue']
        ]).reshape(1, -1)
    else:
        return jsonify({'error': 'Invalid prediction type'}), 400

    # Lakukan prediksi
    prediction = model.predict(features)[0]
    return jsonify({'prediction': int(prediction)})


if __name__ == '__main__':
    app.run(port=5001)

