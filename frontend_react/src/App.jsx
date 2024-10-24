// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Chat from './components/Chat.jsx';
import axios from 'axios';

function App() {
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);

  // Temporary development mode flag
  const isDevelopmentMode = false; // Change this to false when you want to restore the original behavior

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8000/');

        if (response.status === 200) {
          setIsBackendAvailable(true);
          console.log('Connected to backend successfully');
        }
      } catch (error) {
        console.error('Error connecting to the backend: ', error);
      }
    };

    if (!isDevelopmentMode) {
      checkBackendStatus();
    } else {
      setIsBackendAvailable(true); // Bypass the backend check in development mode
    }
  }, [isDevelopmentMode]);

  return (
    <Router>
      <div>
        {isBackendAvailable ? (
          <Routes>
            {/* Home route */}
            <Route path="/" element={<Home />} />

            {/* Chat route */}
            <Route path="/chat/:sessionId" element={<Chat />} />

            {/* Temporary route to view Chat component without backend
            {isDevelopmentMode && <Route path="/chat" element={<Chat />} />} */}
          </Routes>
        ) : (
          <div className="text-center mt-10">
            <h1 className="text-2xl font-bold">Connecting to backend...</h1>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
