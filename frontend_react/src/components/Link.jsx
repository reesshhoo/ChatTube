// src/components/Link.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Link = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Make handleSubmit an async function
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Await the axios POST request
      const response = await axios.post('http://localhost:8000/start-session', {
        youtube_url: youtubeUrl,
      });

      if (response.status === 200) {
        const { session_id } = response.data;
        console.log("Session started successfully with ID: ", session_id);

        // Navigate to the Chat page with session ID as a parameter
        navigate(`/chat/${session_id}`);
      }
    } catch (error) {
      alert("Oops! Something went wrong :(")
      console.error('Error starting session: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-300">
      <form onSubmit={handleSubmit} className="bg-white p-20 rounded shadow-md">
        {/* YouTube URL Input Field */}
        <div className="mb-4">
          <label htmlFor="link" className="block text-gray-900 text-lg font-bold mb-2">Youtube URL:</label>
          <input
            type="url"
            id="link"
            name="link"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="w-full px-20 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mx-1 my-3 py-3 justify-center">
          {loading ? (
            <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-not-allowed" disabled>
              Loading...
            </button>
          ) : (
            <input
              type="submit"
              value="Submit"
              className="bg-blue-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default Link;
