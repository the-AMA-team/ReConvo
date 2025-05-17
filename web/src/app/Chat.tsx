"use client";

import { useState, useRef, useEffect } from "react";
import "./Chat.css";

interface Message {
  id: string;
  content: string;
  sender: "user" | "other";
  timestamp: Date;
  isForm?: boolean;
}

const SUGGESTED_PROMPTS = [
  "Procedures?",
  "Recovery time?",
  "Consultation fees?",
  "Financing options?",
  "Office hours?",
  "Size?",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I assist you today?",
      sender: "other",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    chestBaseDiameter: "",
    skinEnvelope: "",
    tissueExposure: "",
    ramotion: "",
    laterality: "",
    bmi: "",
    aesthetic: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, message]);

    // Special case for "Size?" prompt
    if (content.toLowerCase() === "size?") {
      setTimeout(() => {
        const formMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Please fill out the following details:",
          sender: "other",
          timestamp: new Date(),
          isForm: true,
        };
        setMessages((prev) => [...prev, formMessage]);
      }, 500);
    }

    setNewMessage("");
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const response: Message = {
      id: Date.now().toString(),
      content: `Thank you for providing your details:
        - Chest Base Diameter: ${formData.chestBaseDiameter} cm
        - Skin Envelope: ${formData.skinEnvelope}
        - Tissue Exposure: ${formData.tissueExposure}
        - Ramotion: ${formData.ramotion}
        - Laterality: ${formData.laterality}
        - BMI: ${formData.bmi}
        - Desired Aesthetic: ${formData.aesthetic}`,
      sender: "other",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, response]);
    setFormData({
      chestBaseDiameter: "",
      skinEnvelope: "",
      tissueExposure: "",
      ramotion: "",
      laterality: "",
      bmi: "",
      aesthetic: "",
    });
  };

  const handleChatFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(newMessage);
  };

  return (
    <div className="chat-wrapper">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="chat-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="chat-button-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="chat-button-text">Chat with us</span>
        </button>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-status-dot"></div>
              <h3 className="chat-header-title">Live Chat</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chat-close-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="chat-close-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-empty-state">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="chat-empty-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p>No messages yet</p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-message ${
                      message.sender === "user"
                        ? "chat-message-user"
                        : "chat-message-other"
                    }`}
                  >
                    <div className="chat-message-content">
                      {message.isForm ? (
                        <form onSubmit={handleFormSubmit} className="chat-form">
                          <div className="form-group">
                            <label>Chest Base Diameter (cm)</label>
                            <input
                              type="number"
                              value={formData.chestBaseDiameter}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  chestBaseDiameter: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Skin Envelope</label>
                            <select
                              value={formData.skinEnvelope}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  skinEnvelope: e.target.value,
                                }))
                              }
                              required
                            >
                              <option value="">Select</option>
                              <option value="Y">Yes</option>
                              <option value="N">No</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Tissue Exposure</label>
                            <select
                              value={formData.tissueExposure}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  tissueExposure: e.target.value,
                                }))
                              }
                              required
                            >
                              <option value="">Select</option>
                              <option value="Y">Yes</option>
                              <option value="N">No</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Ramotion</label>
                            <select
                              value={formData.ramotion}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  ramotion: e.target.value,
                                }))
                              }
                              required
                            >
                              <option value="">Select</option>
                              <option value="Y">Yes</option>
                              <option value="N">No</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Laterality</label>
                            <select
                              value={formData.laterality}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  laterality: e.target.value,
                                }))
                              }
                              required
                            >
                              <option value="">Select</option>
                              <option value="uni">Unilateral</option>
                              <option value="bi">Bilateral</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>BMI</label>
                            <input
                              type="number"
                              step="0.1"
                              value={formData.bmi}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  bmi: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Desired Aesthetic</label>
                            <select
                              value={formData.aesthetic}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  aesthetic: e.target.value,
                                }))
                              }
                              required
                            >
                              <option value="">Select</option>
                              <option value="small">Small</option>
                              <option value="natural">Natural</option>
                              <option value="large">Large</option>
                            </select>
                          </div>
                          <button type="submit" className="form-submit-button">
                            Submit
                          </button>
                        </form>
                      ) : (
                        <>
                          <p className="chat-message-text">{message.content}</p>
                          <span className="chat-message-timestamp">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="chat-suggestions">
            <div className="chat-suggestions-list">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="chat-suggestion-button"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleChatFormSubmit}
            className="chat-input-container"
          >
            <div className="chat-input-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="chat-input"
              />
              <button type="submit" className="chat-send-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="chat-send-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
