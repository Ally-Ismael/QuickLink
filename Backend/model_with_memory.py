from flask import Flask, request, jsonify, render_template, session
from flask_cors import CORS
from dotenv import load_dotenv
import os
import uuid
import logging
import requests
from typing import Optional

import chromadb
from chromadb.utils import embedding_functions
import google.generativeai as genai

# Load environment variables
load_dotenv()

FLASK_SECRET_KEY = os.environ.get("FLASK_SECRET_KEY", str(uuid.uuid4()))
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API")

if not GOOGLE_API_KEY:
    raise EnvironmentError("Missing GOOGLE_API_KEY in environment variables")
if not ELEVENLABS_API_KEY:
    raise EnvironmentError("Missing ELEVENLABS_API in environment variables")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask
app = Flask(__name__)
CORS(app)
app.secret_key = FLASK_SECRET_KEY

# Configure Gemini AI
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize ChromaDB
client = chromadb.Client()
collection = client.get_or_create_collection("quicklink_memory")
embed_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

# Helper Functions

def get_user_id() -> str:
    """Return a unique user ID stored in session, creating one if missing."""
    if "user_id" not in session:
        session["user_id"] = str(uuid.uuid4())
    return session["user_id"]

def remember(key: str, value: str) -> None:
    """Store a key-value pair in ChromaDB for the current user."""
    user_id = get_user_id()
    # Using a composite ID for uniqueness across users
    doc_id = f"{user_id}_{key}"
    
    collection.upsert(
        documents=[f"{key}: {value}"],
        metadatas=[{"user_id": user_id, "key": key}],
        ids=[doc_id],
        embeddings=embed_fn([f"{key}: {value}"]),
    )
    logger.info(f"Remembered '{key}': '{value}' for user {user_id}")


def recall(key: str) -> Optional[str]:
    """Retrieve a value from ChromaDB for the current user."""
    user_id = get_user_id()
    results = collection.query(
        query_texts=[key],
        n_results=1,
        where={"$and": [{"user_id": user_id}, {"key": key}]},
    )
    if results["documents"] and results["documents"][0]:
        return results["documents"][0][0].split(": ", 1)[1]
    return None

def recall_semantic(query: str, n_results: int = 3) -> str:
    """Retrieve semantically similar messages from memory for follow-up context."""
    user_id = get_user_id()
    results = collection.query(
        query_texts=[query],
        n_results=n_results,
        where={"user_id": user_id},
    )
    # Combine all retrieved documents into a single string
    context = " ".join([doc for doc_list in results["documents"] for doc in doc_list])
    return context

# Routes
@app.route("/")
def index():
    """Serve the main frontend page."""
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def chat():
    """Chat endpoint with memory integration."""
    data = request.json
    user_message = data.get("question", "").strip()
    if not user_message:
        return jsonify({"error": "Empty question provided"}), 400

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Step 1: Analyze user intent to identify personal information using a structured prompt
        intent_prompt = f"""
        Analyze the following user message to determine if it contains personal information.
        If it does, extract it in a simple key:value format. Do not add any extra text or conversation.
        Keys to look for are 'name', 'favorite_color', and 'goal'.
        If the message is just a general question or greeting, return a blank line.

        Examples:
        - User message: "My name is Alice and I love the color blue."
        - Output: "name:Alice\nfavorite_color:blue"
        - User message: "I want to learn how to code."
        - Output: "goal:learn how to code"
        - User message: "How are you?"
        - Output: ""

        User message: "{user_message}"
        Output:
        """
        
        intent_response = model.generate_content(intent_prompt)
        extracted_info = intent_response.text.strip()
        
        # Step 2: Save the extracted information if found
        if extracted_info:
            for line in extracted_info.split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    key = key.strip().lower().replace(" ", "_")
                    value = value.strip()
                    if key in ["name", "favorite_color", "goal"]:
                        remember(key, value)
            
            # Respond with a confirmation after saving info
            ai_text = "Thanks for sharing that! What else can I help you with?"
            remember("last_response", ai_text)

        else:
            # If no personal info, proceed with normal chat logic
            
            # Build structured context from existing memory
            context_pieces = []
            username = recall("name")
            if username:
                context_pieces.append(f"The user's name is {username}.")
            
            favorite_color = recall("favorite_color")
            if favorite_color:
                context_pieces.append(f"The user's favorite color is {favorite_color}.")
            
            goal = recall("goal")
            if goal:
                context_pieces.append(f"The user's goal is {goal}.")
            
            last_response = recall("last_response")
            if last_response:
                context_pieces.append(f"Previous bot response: {last_response}.")
            
            last_user_message = recall("last_user_message")
            if last_user_message:
                context_pieces.append(f"Previous user message: {last_user_message}.")

            structured_context = " ".join(context_pieces)
            
            # Add semantic memory context
            semantic_context = recall_semantic(user_message)
            full_context = structured_context + " " + semantic_context

            # Use a more detailed prompt for a conversational response
            chat_prompt = f"""
            You are a friendly and helpful AI assistant. Use the following context to answer the user's question.
            Do not use the context if it is not relevant.

            Context: {full_context}

            User: {user_message}
            Assistant:
            """
            
            response = model.generate_content(chat_prompt)
            ai_text = response.text

            # Remember the bot's response AND the user's message
            remember("last_response", ai_text)
            remember("last_user_message", user_message)

    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({"error": str(e)}), 500

    return jsonify({"answer": ai_text})

@app.route("/speak", methods=["POST"])
def speak():
    """Text-to-speech endpoint using ElevenLabs API."""
    data = request.json
    text = data.get("text", "").strip()
    if not text:
        return jsonify({"error": "Empty text provided"}), 400

    url = "https://api.elevenlabs.io/v1/text-to-speech/nPczCjzI2devNBz1zQrb"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "text": text,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            return response.content, 200, {
                "Content-Type": "audio/mpeg",
                "Content-Disposition": "inline; filename=output.mp3",
            }
        return jsonify({"error": response.json()}), response.status_code
    except Exception as e:
        logger.error(f"Error generating speech: {e}")
        return jsonify({"error": str(e)}), 500

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000, use_reloader=False)