from llama_cpp import Llama
import os
from utils.logger import log_interaction

model_path = os.path.join(os.path.dirname(__file__), "../models/phi-2.Q4_0.gguf")
llm = Llama(
    model_path=model_path,
    n_ctx=2048,
    n_threads=4,
    verbose=False
)

def generate_response(prompt: str) -> str:
    try:
        full_prompt = f"Q: {prompt}\nA:"
        output = llm(
            prompt=full_prompt,
            max_tokens=200,
            temperature=0.7,
            echo=False
        )
        response = output['choices'][0]['text'].strip()
        log_interaction(prompt, response)
        return response
    except Exception as e:
        return f"Error generating response: {str(e)}"