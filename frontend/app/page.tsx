"use client";

import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState(null);

  const callBackend = async () => {
    // 브라우저에서 호출하므로 localhost 사용 (주의: Docker 내부 통신 아님)
    const res = await fetch("http://localhost:8000/api/analyze?text=hello");
    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h1>Docker Practice</h1>
      <button onClick={callBackend}>AI 분석 요청</button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
