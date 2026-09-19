import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SUGGESTIONS = [
  "What are the top skills in demand?",
  "Which city has the most job postings?",
  "What is the average salary for Data Analyst jobs?",
  "Which skills are associated with higher salaries?",
];

export default function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async (text = question) => {
    const query = text.trim();

    if (!query || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: query,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/ai/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: query,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.answer ||
            "I couldn't generate an answer.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn't connect to the AI service. Please make sure the FastAPI backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    askQuestion();
  };

  return (
    <section className="jm-ai-page">
      <div className="jm-ai-header">
        <p className="jm-eyebrow">INTELLIGENT JOB ANALYSIS</p>

        <h1>AI Assistant</h1>

        <p>
          Ask questions about jobs, skills, salaries,
          companies, and hiring trends.
        </p>
      </div>

      <div className="jm-ai-panel">
        <div className="jm-ai-panel__top">
          <div className="jm-ai-status">
            <span className="jm-ai-status__dot" />
            AI Assistant Online
          </div>
        </div>

        {messages.length === 0 && (
          <div className="jm-ai-welcome">
            <div className="jm-ai-welcome__icon">✦</div>

            <h2>How can I help?</h2>

            <p>
              Ask me anything about the job market dataset.
            </p>

            <div className="jm-ai-suggestions">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => askQuestion(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="jm-ai-messages">
            {messages.map((message, index) => (
              <div
                className={`jm-ai-message ${
                  message.role === "user"
                    ? "jm-ai-message--user"
                    : "jm-ai-message--assistant"
                }`}
                key={index}
              >
                <div className="jm-ai-message__label">
                  {message.role === "user"
                    ? "You"
                    : "AI Assistant"}
                </div>

                <div className="jm-ai-message__content">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
  {message.content}
</ReactMarkdown>
</div>
              </div>
            ))}

            {loading && (
              <div className="jm-ai-message jm-ai-message--assistant">
                <div className="jm-ai-message__label">
                  AI Assistant
                </div>

                <div className="jm-ai-typing">
                  Analyzing job market data...
                </div>
              </div>
            )}
          </div>
        )}

        <form
          className="jm-ai-input"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Ask about jobs, skills, salaries..."
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
          />

          <button
            type="submit"
            disabled={!question.trim() || loading}
          >
            {loading ? "..." : "Ask AI →"}
          </button>
        </form>
      </div>
    </section>
  );
}