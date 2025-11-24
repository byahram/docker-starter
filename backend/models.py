from sqlalchemy import Column, Integer, String
from database import Base

class AnalysisLog(Base):
    __tablename__ = "analysis_logs"  # 실제 DB에 생길 테이블 이름

    id = Column(Integer, primary_key=True, index=True)
    input_text = Column(String, index=True) # 사용자가 입력한 텍스트
    ai_score = Column(Integer)              # AI가 예측한 점수
    