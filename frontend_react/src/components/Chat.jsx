// src/components/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Chat = () => {
  // State to manage chat messages
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! What would you like to know about the given video?' },
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const { sessionId } = useParams(); // Retrieve sessionId from the URL

  // Scroll to the bottom of the chat container whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending a message to the chatbot
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      // Add user message to the chat
      const newMessages = [...messages, { sender: 'user', text: userInput }];
      setMessages(newMessages);
      setUserInput('');
      setLoading(true);

      try {
        // Send user message to the backend /chat endpoint
        const response = await axios.post('http://localhost:8000/chat', {
          session_id: sessionId,
          query: userInput,
        });

        if (response.status === 200) {
          const botResponse = response.data.response;
          // Add chatbot response to the chat
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: botResponse },
          ]);
        } else {
          alert('Oops! Something went wrong with the chatbot.');
        }
      } catch (error) {
        console.error('Error communicating with the chatbot: ', error);
        alert('Oops! Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle ending the chat session
// Handle ending the chat session
const handleEndChat = async () => {
  try {
    // Send the session_id as an object to the backend
    const response = await axios.post('http://localhost:8000/end-session', {
      session_id: sessionId,
    });

    if (response.status === 200) {
      // If the backend responds with status 200, navigate back to the Home page
      navigate('/');
      console.log("Deleted the session with session id: ", sessionId)
    } else {
      alert('Failed to end chat session properly.');
    }
  } catch (error) {
    console.error('Error ending the chat session: ', error);
    alert('Oops! Something went wrong while ending the session.');
  }
};


  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between items-center h-screen bg-gray-100">
        {/* Chat Container with Reduced Height */}
        <div className="flex flex-col w-full max-w-4xl h-[840px] bg-white shadow-lg rounded-lg overflow-hidden mt-4 mb-4">
          {/* Chat Messages Area */}
          <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex mb-4 ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`p-4 rounded-lg shadow ${
                    message.sender === 'bot' ? 'bg-gray-200 text-black' : 'bg-blue-500 text-white'
                  } max-w-xs`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Area */}
          <div className="p-4 border-t border-gray-300">
            <form className="flex items-center" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="flex-1 border rounded-lg px-4 py-2 mr-4 focus:outline-none"
                placeholder="Type your message here..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={loading} // Disable input while loading
              />
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none"
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
              <button
          className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none ml-3"
          onClick={handleEndChat}
        >
          End Chat
        </button>
            </form>
          </div>
        </div>

        {/* End Chat Button */}
        
      </div>
    </>
  );
};

export default Chat;
