FROM python:3.9-slim
WORKDIR /app

# 1. requirements.txt 파일을 먼저 컨테이너로 복사합니다.
COPY requirements.txt .

# 2. requirements.txt 안에 적힌 라이브러리들을 설치합니다.
RUN pip install --no-cache-dir -r requirements.txt

# 3. 나머지 소스 코드를 복사합니다.
COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
