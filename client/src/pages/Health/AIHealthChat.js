/**
 * AI Health Chat Component
 * 
 * Interactive health chat and symptom checker
 * powered by AI
 */

import React, { useState, useRef, useEffect } from "react";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import { toast } from "react-toastify";
import "./AIHealthChat.css";

const AIHealthChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Health Assistant. I can help you understand your symptoms, provide first aid guidance, and answer health questions. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages([...messages, userMsg]);
    setInputMessage("");

    // Get AI response
    setLoading(true);
    try {
      const { data } = await API.post("/ai-health/chat", {
        userMessage: inputMessage,
      });

      if (data.success) {
        const botMsg = {
          id: messages.length + 2,
          text: data.response,
          sender: "bot",
          timestamp: new Date(),
          disclaimer: data.disclaimer,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error getting response from AI");
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "What should I do if I have chest pain?",
    "I'm experiencing shortness of breath",
    "What are symptoms of diabetes?",
    "How do I manage high blood pressure?",
  ];

  const handleQuickQuestion = async (question) => {
    setInputMessage(question);
    // Trigger send after setting the message
    setTimeout(() => {
      const form = document.querySelector(".chat-input-form");
      form?.dispatchEvent(new Event("submit", { bubbles: true }));
    }, 0);
  };

  return (
    <Layout>
      <div className="ai-chat-container">
        <div className="chat-header">
          <h2>
            <i className="fas fa-robot me-2"></i>AI Health Assistant
          </h2>
          <p className="text-muted">
            Get instant health information and first aid guidance
          </p>
        </div>

        <div className="chat-body">
          <div className="messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
              >
                <div className="message-content">
                  {msg.text}
                  {msg.disclaimer && (
                    <small className="d-block mt-2 text-warning">
                      <i className="fas fa-info-circle me-1"></i>
                      {msg.disclaimer}
                    </small>
                  )}
                </div>
                <small className="message-time">
                  {msg.timestamp.toLocaleTimeString()}
                </small>
              </div>
            ))}
            {loading && (
              <div className="message bot-message">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="quick-questions mt-4">
              <p className="text-center text-muted mb-3">
                <small>Quick Questions:</small>
              </p>
              <div className="row">
                {quickQuestions.map((question, index) => (
                  <div key={index} className="col-md-6 mb-2">
                    <button
                      className="btn btn-outline-primary btn-sm w-100 text-start"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type your health question or symptom..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !inputMessage.trim()}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AIHealthChat;

