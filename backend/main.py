from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import requests
import os

# 위에서 만든 파일들 임포트
import models
from database import engine, get_db

# DB 테이블 자동 생성 (서버 시작 시 테이블이 없으면 만듭니다)
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

AI_SERVICE_URL = os.getenv("AI_URL", "http://ai-service:5000")

# 1. [저장] AI 분석 요청 및 결과 DB 저장
@app.get("/api/analyze")
def analyze_data(text: str, db: Session = Depends(get_db)):
    # (1) AI 서비스 호출
    try:
        response = requests.get(f"{AI_SERVICE_URL}/predict", params={"input_data": text})
        ai_result = response.json()
        score = ai_result.get("score", 0)
    except Exception as e:
        return {"error": "AI Service not responding", "details": str(e)}

    # (2) DB에 저장 (SQLAlchemy 사용)
    new_log = models.AnalysisLog(input_text=text, ai_score=score)
    db.add(new_log)
    db.commit()      # 확정
    db.refresh(new_log) # 저장된 데이터(ID 포함) 다시 가져오기
    
    return {
        "message": "Analysis done & Saved to DB",
        "data": new_log
    }

# 2. [조회] 저장된 모든 기록 가져오기
@app.get("/api/logs")
def get_logs(db: Session = Depends(get_db)):
    # DB에서 모든 AnalysisLog 조회
    logs = db.query(models.AnalysisLog).all()
    return logs
