import React, { useState } from "react";
import "./ChatWidget.css"; // Add styles here
import { BsChatDotsFill } from "react-icons/bs"; // For the chat icon

const ChatWidget = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Chat Widget Button */}
      <div className="chat-widget" onClick={toggleChat}>
        <BsChatDotsFill size={24} color="white" />
      </div>

      {/* Chatbox */}
      {isChatOpen && (
        <div className="chatbox">
          <div className="chatbox-header">
            <h6>Need help?</h6>
            <button className="close-chat" onClick={toggleChat}>
              &times;
            </button>
          </div>

          <div className="chatbox-body">
            <div className="chat-message">
              <strong>Welcome!</strong>
              <p>Hi there! How can we assist you today?</p>
            </div>

            <button className="btn btn-primary btn-sm me-2">For Him</button>
            <button className="btn btn-secondary btn-sm">For Her</button>
          </div>

          <div className="chatbox-footer">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
            />
            <button className="btn btn-primary">Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
