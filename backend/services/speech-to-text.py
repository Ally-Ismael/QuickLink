import whisper

model = whisper.load_model("tiny.en")
audio_path = ''

def transcribe_audio(audio_path: str) -> str:
    try:
        result = model.transcribe(audio_path)
        return result['text']
    except Exception as e:
        return f"Could not transcribe audio. {e}"

transcription = transcribe_audio(audio_path)
print(transcription)