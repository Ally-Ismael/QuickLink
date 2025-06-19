from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from services.ai_service import generate_response
from services.stt_service import transcribe_audio
from services.tts_service import text_to_speech
import os
from datetime import datetime

app = FastAPI()

@app.post("/voice")
async def process_voice_query(file: UploadFile = File(...)):
    try:
        # Save incoming audio
        audio_path = f"data/audio_samples/query_{datetime.now().timestamp()}.wav"
        with open(audio_path, "wb") as f:
            f.write(await file.read())
        
        # Process pipeline
        text = transcribe_audio(audio_path)
        response = generate_response(text)
        output_path = text_to_speech(response)
        
        return FileResponse(output_path)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)