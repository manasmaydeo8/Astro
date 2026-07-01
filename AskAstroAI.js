import React, { useState } from "react";
import API from "../api";
import "./AskAstroAI.css";

export default function AskAstroAI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await API.post("/api/ask", { question });
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer("Error: Unable to fetch response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-ai-page">
      <h2>🪶 Ask the Astrology AI</h2>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything about astrology..."
      />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? "Thinking..." : "Ask"}
      </button>
      {answer && (
        <div className="ai-answer">
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
