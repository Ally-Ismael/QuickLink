import ChatTTS
import torch
import torchaudio

chat = ChatTTS.Chat()
chat.load(compile=False)

texts = ["hello, i am a software engineer"]

wavs = chat.infer(texts)

for i in range(len(wavs)):
    try:
        torchaudio.save(f"basic_output{i}.wav", torch.from_numpy(wavs[i]).unsqueeze(0), 24000)
    except:
        torchaudio.save(f"basic_output{i}.wav", torch.from_numpy(wavs[i]), 24000)
