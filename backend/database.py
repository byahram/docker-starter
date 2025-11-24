from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Docker Compose의 environment에서 설정한 주소를 가져옵니다.
# 없을 경우를 대비해 기본값도 넣어두지만, Docker 안에선 환경변수가 우선됩니다.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/testdb")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# DB 세션을 가져오는 도우미 함수 (Dependency Injection용)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
