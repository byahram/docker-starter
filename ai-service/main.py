from fastapi import FastAPI
import random

app = FastAPI()

@app.get("/predict")
def predict(input_data: str):
    # 실제 AI 모델 대신 랜덤 점수 반환 (예시)
    score = random.randint(0, 100)
    return {
        "input": input_data, 
        "score": score, 
        "status": "AI Analysis Complete"
    }
