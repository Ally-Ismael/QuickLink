from flask import Flask, request, Response
from twilio.twiml.messaging_response import MessagingResponse
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

app = Flask(__name__)

@app.route("/sms", methods=['POST'])
def sms_reply():
    incoming_msg = request.form.get('Body')
    print(f"Received: {incoming_msg}")

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(incoming_msg)
        ai_reply = response.text.strip() if response and response.text else "Sorry, I couldn’t generate a reply."
    except Exception as e:
        print(f"Gemini error: {e}")
        ai_reply = "There was an issue processing your request."

    twilio_resp = MessagingResponse()
    twilio_resp.message(ai_reply)

    return Response(str(twilio_resp), mimetype="application/xml")

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)