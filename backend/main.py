from fastapi import FastAPI
import requests
import os

app = FastAPI()

# Docker Compose에서 정의할 환경변수나 서비스 이름 사용
AI_SERVICE_URL = "http://ai-service:5000/predict" 

@app.get("/api/analyze")
def analyze_data(text: str):
    # 1. AI 서비스에 요청 보내기 (Service-to-Service 통신)
    response = requests.get(AI_SERVICE_URL, params={"input_data": text})
    ai_result = response.json()
    
    # 2. DB 저장 로직은 생략 (연결 확인용 메시지만 반환)
    # 실제로는 여기서 SQLAlchmey 등으로 DB에 저장함
    return {
        "message": "Backend received request",
        "ai_result": ai_result,
        "db_status": "Connected to Postgres (Simulated)"
    }
