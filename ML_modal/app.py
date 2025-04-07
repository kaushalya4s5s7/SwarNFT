from flask import Flask, request, jsonify
import pandas as pd
import joblib  # Assuming you load `song_cluster_pipeline` using joblib

app = Flask(__name__)

# Load Data & Model
spotify_data = pd.read_csv("data.csv")  # Ensure this dataset is correct
song_cluster_pipeline = joblib.load("Music_Recommendation_System.pkl")  # Load model

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json  # Get JSON payload
        song_list = data.get("songs", [])  # Extract songs list

        if not song_list:
            return jsonify({"error": "No songs provided"}), 400

        recommendations = recommend_songs(song_list, spotify_data, song_cluster_pipeline)

        if not recommendations:
            return jsonify({"error": "No recommendations found"}), 404

        return jsonify({"recommendations": recommendations})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
