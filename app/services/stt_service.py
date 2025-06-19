import whispercpp as whisper
import os
from utils.logger import log_error

model_path = os.path.join(os.path.dirname(__file__), "../models/whisper-tiny.en")
model = whisper.Whisper.from_pretrained("tiny.en")

def transcribe_audio(audio_path: str) -> str:
    try:
        result = model.transcribe(audio_path)
        return result.strip()
    except Exception as e:
        log_error(f"STT Error: {str(e)}")
        return "Could not transcribe audio"