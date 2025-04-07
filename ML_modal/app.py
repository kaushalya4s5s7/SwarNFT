from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import joblib
from sklearn.metrics.pairwise import cosine_similarity
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import time
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Get Spotify API credentials from environment variables
SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')

# Debug to check if environment variables are loading
logger.info(f"Client ID found: {'Yes' if SPOTIFY_CLIENT_ID else 'No'}")
logger.info(f"Client Secret found: {'Yes' if SPOTIFY_CLIENT_SECRET else 'No'}")

# If we can't find the credentials, look for them in spotipy's expected env vars
if not SPOTIFY_CLIENT_ID:
    SPOTIFY_CLIENT_ID = os.getenv('SPOTIPY_CLIENT_ID')
    logger.info(f"Looking for SPOTIPY_CLIENT_ID: {'Found' if SPOTIFY_CLIENT_ID else 'Not found'}")
if not SPOTIFY_CLIENT_SECRET:
    SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIPY_CLIENT_SECRET')
    logger.info(f"Looking for SPOTIPY_CLIENT_SECRET: {'Found' if SPOTIFY_CLIENT_SECRET else 'Not found'}")

# Initialize Spotify client if credentials are available
sp = None
if SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET:
    try:
        client_credentials_manager = SpotifyClientCredentials(
            client_id=SPOTIFY_CLIENT_ID,
            client_secret=SPOTIFY_CLIENT_SECRET
        )
        sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
        logger.info("Spotify client initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing Spotify client: {e}")
else:
    logger.warning("Spotify credentials not found. Only local dataset will be available.")

# Load your local model
try:
    song_cluster_pipeline = joblib.load("Music_Recommendation_System.pkl")
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    song_cluster_pipeline = None

# Load local dataset
try:
    CSV_ENCODING = 'latin1'
    PARSE_ENGINE = 'python'
    ON_BAD_LINES = 'skip'
    spotify_data = pd.read_csv("data.csv",
                               encoding=CSV_ENCODING,
                               engine=PARSE_ENGINE,
                               on_bad_lines=ON_BAD_LINES)
    logger.info(f"Local dataset loaded successfully. Shape: {spotify_data.shape}")
    # Log some sample data to verify content
    if not spotify_data.empty:
        logger.info(f"Columns in dataset: {spotify_data.columns.tolist()}")
        logger.info(f"Sample song names: {spotify_data['name'].head(5).tolist() if 'name' in spotify_data.columns else 'No name column found'}")
except Exception as e:
    logger.error(f"Error loading local dataset: {e}")
    spotify_data = pd.DataFrame()

def get_song_features_from_spotify(song_names):
    """
    Fetch audio features for a list of songs from Spotify API
    """
    if not sp:
        logger.warning("Spotify client not initialized. Cannot fetch song features.")
        return pd.DataFrame()
    
    song_data = []
    for song_name in song_names:
        try:
            logger.info(f"Searching Spotify for: {song_name}")
            results = sp.search(q=song_name, limit=1, type='track')
            if not results['tracks']['items']:
                logger.warning(f"No results found for: {song_name}")
                continue
            
            track = results['tracks']['items'][0]
            track_id = track['id']
            track_name = track['name']
            logger.info(f"Found track: {track_name} (ID: {track_id})")
            
            audio_features = sp.audio_features(track_id)[0]
            if not audio_features:
                logger.warning(f"No audio features for: {track_name}")
                continue
            
            # Ensure all numeric fields are properly cast to float
            song_info = {
                'name': track_name,
                'id': track_id,
                'acousticness': float(audio_features.get('acousticness', 0.0)),
                'danceability': float(audio_features.get('danceability', 0.0)),
                'energy': float(audio_features.get('energy', 0.0)),
                'instrumentalness': float(audio_features.get('instrumentalness', 0.0)),
                'liveness': float(audio_features.get('liveness', 0.0)),
                'loudness': float(audio_features.get('loudness', 0.0)),
                'speechiness': float(audio_features.get('speechiness', 0.0)),
                'tempo': float(audio_features.get('tempo', 0.0)),
                'valence': float(audio_features.get('valence', 0.0))
            }
            song_data.append(song_info)
            logger.info(f"Successfully fetched data for: {track_name}")
            
            time.sleep(0.2)  # Rate limiting
            
        except Exception as e:
            logger.error(f"Error processing song {song_name}: {str(e)}")
    
    if song_data:
        df = pd.DataFrame(song_data)
        logger.info(f"Created DataFrame with {len(df)} songs from Spotify")
        return df
    else:
        logger.warning("No song data collected from Spotify")
        return pd.DataFrame()

def recommend_songs_local(song_list, num_recommendations=5):
    """
    Recommend songs using only the local dataset
    """
    logger.info(f"Using local dataset for recommendations with songs: {song_list}")
    if spotify_data.empty:
        logger.error("Local dataset is empty")
        return []
    
    # Check if 'name' column exists
    if 'name' not in spotify_data.columns:
        logger.error("No 'name' column in local dataset")
        return []
    
    mask = spotify_data['name'].isin(song_list)
    input_songs_df = spotify_data[mask]
    logger.info(f"Found {len(input_songs_df)} of {len(song_list)} songs in local dataset")
    
    if input_songs_df.empty:
        logger.warning("No matching songs found in local dataset")
        return []
    
    features = []
    for feature in ['acousticness', 'danceability', 'energy', 'instrumentalness', 
                    'liveness', 'loudness', 'speechiness', 'tempo', 'valence']:
        if feature in spotify_data.columns:
            # Ensure column is numeric
            if not pd.api.types.is_numeric_dtype(spotify_data[feature]):
                logger.warning(f"Column '{feature}' is not numeric. Converting to numeric...")
                spotify_data[feature] = pd.to_numeric(spotify_data[feature], errors='coerce')
            features.append(feature)
    
    if not features:
        logger.error("No audio features found in local dataset")
        return []
    
    logger.info(f"Using features: {features}")
    
    input_features = input_songs_df[features].values
    
    if song_cluster_pipeline and hasattr(song_cluster_pipeline, 'transform'):
        logger.info("Using model to transform features")
        try:
            input_vectors = song_cluster_pipeline.transform(input_features)
            all_song_vectors = song_cluster_pipeline.transform(spotify_data[features].values)
        except Exception as e:
            logger.error(f"Error transforming with model: {e}")
            input_vectors = input_features
            all_song_vectors = spotify_data[features].values
    else:
        logger.info("Using raw features (no model transform)")
        input_vectors = input_features
        all_song_vectors = spotify_data[features].values
    
    similarities = cosine_similarity(input_vectors.mean(axis=0).reshape(1, -1), all_song_vectors)
    similar_song_indices = np.argsort(similarities[0])[::-1]
    input_song_indices = input_songs_df.index
    recommended_indices = [idx for idx in similar_song_indices if idx not in input_song_indices]
    top_recommendations = recommended_indices[:num_recommendations]
    
    if len(top_recommendations) > 0:
        recommendations = spotify_data.iloc[top_recommendations]['name'].tolist()
        logger.info(f"Found {len(recommendations)} recommendations: {recommendations}")
        return recommendations
    else:
        logger.warning("No recommendations found after filtering")
        return []

def recommend_songs_spotify(song_list, num_recommendations=5):
    """
    Recommend songs using Spotify API
    """
    logger.info(f"Using Spotify API for recommendations with songs: {song_list}")
    if not sp:
        logger.warning("Spotify client not available")
        return []
    
    # Get input songs data from Spotify
    input_songs_df = get_song_features_from_spotify(song_list)
    if input_songs_df.empty:
        logger.warning("No songs found on Spotify")
        return []
    
    # Use recommendations from Spotify directly
    logger.info("Fetching recommendations from Spotify API")
    try:
        # Get seed track IDs (up to 5)
        seed_track_ids = input_songs_df['id'].tolist()[:5]
        # Get recommendations from Spotify
        spotify_recommendations = sp.recommendations(seed_tracks=seed_track_ids, limit=num_recommendations)
        # Extract recommended track names
        recommendations = []
        for track in spotify_recommendations['tracks']:
            recommendations.append(track['name'])
        logger.info(f"Spotify API returned {len(recommendations)} recommendations")
        return recommendations
    except Exception as e:
        logger.error(f"Error getting recommendations from Spotify: {e}")
        # Fallback - try getting related artist tracks
        logger.info("Falling back to related artists method")
        recommendation_pool = []
        for _, song in input_songs_df.iterrows():
            track_id = song['id']
            try:
                # Get track info
                track_info = sp.track(track_id)
                # Get artist info
                artist_id = track_info['artists'][0]['id']
                # Get related artists
                related_artists = sp.artist_related_artists(artist_id)['artists'][:2]
                for artist in related_artists:
                    # Get top tracks from related artists
                    top_tracks = sp.artist_top_tracks(artist['id'])['tracks'][:3]
                    for track in top_tracks:
                        recommendation_pool.append({
                            'name': track['name'],
                            'id': track['id']
                        })
            except Exception as artist_error:
                logger.error(f"Error getting related artists for {track_id}: {artist_error}")
        
        # Return unique recommendations
        if recommendation_pool:
            unique_recommendations = []
            seen_ids = set()
            for item in recommendation_pool:
                if item['id'] not in seen_ids:
                    seen_ids.add(item['id'])
                    unique_recommendations.append(item['name'])
            logger.info(f"Found {len(unique_recommendations)} recommendations from related artists")
            return unique_recommendations[:num_recommendations]
        else:
            logger.warning("No recommendations found from related artists")
            return []

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json  # Get JSON payload
        logger.info(f"Received request: {data}")
        
        song_list = data.get("songs", [])  # Extract songs list
        use_spotify = data.get("use_spotify_api", True)  # Option to use Spotify API
        
        # Ensure num_recommendations is an integer
        num_recommendations = data.get("num_recommendations", 5)
        if not isinstance(num_recommendations, int):
            try:
                num_recommendations = int(num_recommendations)
            except (ValueError, TypeError):
                logger.error("Invalid num_recommendations value")
                return jsonify({"error": "num_recommendations must be an integer"}), 400
        
        if not song_list:
            logger.warning("No songs provided in request")
            return jsonify({"error": "No songs provided"}), 400
        
        # Try Spotify API first if requested
        recommendations = []
        if use_spotify and sp:
            logger.info("Attempting Spotify API recommendations")
            recommendations = recommend_songs_spotify(song_list, num_recommendations)
        
        # Fall back to local dataset if no Spotify recommendations
        if not recommendations:
            logger.info("Falling back to local dataset recommendations")
            recommendations = recommend_songs_local(song_list, num_recommendations)
        
        if not recommendations:
            logger.warning("No recommendations found")
            return jsonify({"error": "No recommendations found"}), 404
        
        logger.info(f"Returning {len(recommendations)} recommendations")
        return jsonify({"recommendations": recommendations})
    
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """
    Simple health check endpoint
    """
    status = {
        "status": "online",
        "spotify_client": "connected" if sp else "disconnected",
        "model_loaded": "yes" if song_cluster_pipeline else "no",
        "local_data": "available" if not spotify_data.empty else "unavailable"
    }
    return jsonify(status)

if __name__ == '__main__':
    app.run(port=5001, debug=True)