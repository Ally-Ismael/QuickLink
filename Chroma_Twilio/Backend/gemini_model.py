from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import requests
import os


load_dotenv()
app = Flask(__name__)
CORS(app)

# Configure Gemini
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

# --- Serve frontend ---
@app.route("/")
def index():
    return render_template("index.html")

# --- Chat endpoint ---
@app.route("/ask", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("question", "")

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(user_message)
        ai_text = response.text
        return jsonify({"answer": ai_text})  # key is "answer" for frontend
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Speak endpoint (ElevenLabs TTS) ---
@app.route("/speak", methods=["POST"])
def speak():
    data = request.json
    text = data.get("text", "")

    try:
        url = "https://api.elevenlabs.io/v1/text-to-speech/nPczCjzI2devNBz1zQrb"
        headers = {
            "xi-api-key": os.environ.get("ELEVENLABS_API"),
            "Content-Type": "application/json"
        }
        payload = {
            "text": text,
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }

        response = requests.post(url, headers=headers, json=payload)

        if response.status_code == 200:
            return response.content, 200, {
                "Content-Type": "audio/mpeg",
                "Content-Disposition": "inline; filename=output.mp3"
            }
        else:
            return jsonify({"error": response.json()}), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
