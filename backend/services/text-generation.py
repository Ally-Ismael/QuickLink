from ollama import Client

client = Client()
model = 'hf.co/TheBloke/phi-2-GGUF:phi-2.Q4_0'
prompt = 'what is deforestation?'

try:   
    response = client.generate(
        model=model,
        prompt=f"Q: {prompt} \nA:",
        options={
            'temperature': 0.7,
            'num_predict': 200
        },
        stream=True
    )
except Exception as e:
    print(f"Error generating response: {str(e)}")

for chunk in response:
    print(chunk['response'], end='', flush=True)