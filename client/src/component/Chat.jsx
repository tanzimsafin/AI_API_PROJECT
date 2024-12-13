import React, { useState, useRef } from "react";
import "./ChatWidget.css";
import { BsChatDotsFill } from "react-icons/bs";

const ChatWidget = () => {
  const promptElement = useRef(null);//use ref for get the value of input
  const [currentPrompt, setCurrentPrompt] = useState(""); //get the prompt from input
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null); // Change to null
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

 const url = "https://api.edenai.run/v2/workflow/77b16f10-9795-40ff-8da5-8d1dff493a94/execution/"
  const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMWMwM2MxOGUtZDIxMS00ZGZjLWFkY2ItZTllZjZlNGNlYTZhIiwidHlwZSI6ImFwaV90b2tlbiJ9.zSvQRU56kx94OHmzhwulTELYbp5j8HnVQorl73mPX4c";
 // Ai Fetching Code 
  const launchExecution = async () => {
    try {
      const payload = { prompt: currentPrompt || "Hello" };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error launching execution:", error);
      setError("Failed to start AI conversation");
      throw error;
    }
  };

  const getExecutionResult = async (executionId) => {
    const resultUrl = `${url}${executionId}/`;
    let status = "processing";
    let result;
    let attempts = 0;
    const maxAttempts = 30; // Increased timeout to 60 seconds 

    while (status === "processing" && attempts < maxAttempts) {
      try {
        const response = await fetch(resultUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        result = await response.json();
        status = result.content.status;

        if (status === "processing") {
          await new Promise(resolve => setTimeout(resolve, 2000)); // wait for 2 seconds before polling again
          attempts++;
        }
      } catch (error) {
        console.error("Error polling execution result:", error);
        setError("Failed to retrieve AI response");
        throw error;
      }
    }

    if (status === "processing") {
      throw new Error("Execution timed out");
    }

    return result;
  };

  const fetchAIData = async () => {
    // Prevent empty submissions
    if (!currentPrompt.trim()) {
      setError("Please enter a message");
      return;
    }

    // Reset previous states
    setError(null);
    setIsLoading(true);
    setResponseMessage(null);

    try {
      const execution = await launchExecution();
      const data = await getExecutionResult(execution.id);

      // Extract generated text with fallback
      const generatedText = 
        data.content?.results?.text__chat?.results?.[0]?.generated_text || 
        "No response generated";

      setResponseMessage({
        user: currentPrompt,
        ai: generatedText
      });
      
      // Clear input after successful submission
      setCurrentPrompt("");
    } catch (error) {
      // Error handling is done in the catch blocks
      setResponseMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setCurrentPrompt(event.target.value);
    // Clear any previous errors when user starts typing
    if (error) setError(null);
  };

  const handleKeyPress = (event) => {
    // Allow sending message by pressing Enter
    if (event.key === 'Enter' && !isLoading) {
      fetchAIData();
    }
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
            {/* Welcome message - shows by default */}
            {!responseMessage && !error && !isLoading && (
              <div className="chat-message">
                <strong>Welcome!</strong>
                <p>Hi there! How can we assist you today?</p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="chat-message error">
                <strong>Error:</strong>
                <p>{error}</p>
              </div>
            )}

            {/* User Message */}
            {responseMessage?.user && (
              <div className="chat-message user-message">
                <strong>You:</strong>
                <p>{responseMessage.user}</p>
              </div>
            )}

            {/* AI Response */}
            {responseMessage?.ai && (
              <div className="chat-message ai-response">
                <strong>Advisor:</strong>
                <p>{responseMessage.ai}</p>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="chat-message loading">
                <p>Generating response...</p>
              </div>
            )}
          </div>

          <div className="chatbox-footer">
            <input
              type="text"
              ref={promptElement}
              className="form-control"
              placeholder="Type your message..."
              value={currentPrompt}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
            />
            <button 
              onClick={fetchAIData} 
              className="btn btn-primary"
              disabled={isLoading || !currentPrompt.trim()}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;