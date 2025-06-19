import sounddevice as sd
import soundfile as sf
import numpy as np

def record_audio(duration=5, sample_rate=16000):
    """Record audio from microphone"""
    print(f"Recording for {duration} seconds...")
    recording = sd.rec(int(duration * sample_rate), 
                      samplerate=sample_rate, 
                      channels=1,
                      dtype='float32')
    sd.wait()
    return recording, sample_rate

def save_audio(recording, sample_rate, path):
    """Save audio to file"""
    sf.write(path, recording, sample_rate)