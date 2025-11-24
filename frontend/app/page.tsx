"use client";
import { useState, useEffect } from "react";

export default function Home() {
  // 1. 입력한 텍스트 상태
  const [inputText, setInputText] = useState("");
  // 2. 현재 분석 결과 상태
  const [currentResult, setCurrentResult] = useState<any>(null);
  // 3. 과거 기록 리스트 상태
  const [history, setHistory] = useState<any[]>([]);

  // -- 기능 1: AI 분석 요청 (저장) --
  const analyzeData = async () => {
    if (!inputText) return alert("텍스트를 입력해주세요!");

    try {
      // 브라우저 -> 백엔드(localhost:8000) 호출
      const res = await fetch(
        `http://localhost:8000/api/analyze?text=${inputText}`
      );
      const data = await res.json();
      setCurrentResult(data);
      // 분석이 끝나면 목록을 새로고침해서 방금 저장된 것도 보여줌
      fetchHistory();
      setInputText("");
    } catch (error) {
      console.error("분석 실패:", error);
      alert("백엔드 연결 실패! Docker가 켜져 있나요?");
    }
  };

  // -- 기능 2: 과거 기록 가져오기 (조회) --
  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/logs");
      const data = await res.json();
      setHistory(data.reverse());
    } catch (error) {
      console.error("기록 조회 실패:", error);
    }
  };

  // 페이지가 처음 로드될 때 기록 가져오기
  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1>🚀 Docker Microservices 실습</h1>

      {/* 입력 섹션 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2>AI 분석 요청</h2>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="분석할 문장을 입력하세요"
          style={{ padding: "10px", width: "70%", marginRight: "10px" }}
        />
        <button
          onClick={analyzeData}
          style={{
            padding: "10px 20px",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          분석 & 저장
        </button>

        {/* 방금 분석한 결과 보여주기 */}
        {currentResult && (
          <div
            style={{
              marginTop: "10px",
              background: "#f0f9ff",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            <p>
              <strong>방금 분석 결과:</strong> AI 점수{" "}
              {currentResult.data.ai_score}점 (ID: {currentResult.data.id})
            </p>
          </div>
        )}
      </div>

      {/* 리스트 섹션 */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "#f9f9f9",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>📜 분석 히스토리 (DB 조회)</h2>
          <button
            onClick={fetchHistory}
            style={{ padding: "5px 10px", cursor: "pointer" }}
          >
            새로고침
          </button>
        </div>

        {history.length === 0 ? (
          <p>저장된 기록이 없습니다.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {history.map((item: any) => (
              <li
                key={item.id}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>📝 {item.input_text}</span>
                <span
                  style={{
                    fontWeight: "bold",
                    color: item.ai_score > 50 ? "green" : "red",
                  }}
                >
                  {item.ai_score}점
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
