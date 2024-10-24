# ChatTube

ChatTube is a web application that allows users to interact with YouTube videos through a question-answer interface powered by large language models (LLMs). The app accepts a YouTube video URL, downloads the video, transcribes it using OpenAI Whisper, and employs Retrieval-Augmented Generation (RAG) to provide contextual answers based on the video content.

## Features
- **Video Transcription**: Automatically transcribes YouTube videos using OpenAI Whisper.
- **Contextual Q&A**: Fetches relevant context from a vector database to generate accurate answers to user questions.
- **LLM-Powered Responses**: Uses Ollama LLM with the retrieved context to provide intelligent responses.
- **Fast and Intuitive Interface**: Built with a ReactJS frontend and FASTAPI backend for seamless interaction.

## Tech Stack
- **Backend**: FASTAPI - Provides API endpoints for video processing, transcription, and LLM interactions.
- **Frontend**: ReactJS - User-friendly interface to input YouTube URLs and ask questions.
- **Transcription**: OpenAI Whisper - High-accuracy transcription of video audio.
- **Question Answering**: RAG (Retrieval-Augmented Generation) - Enhances LLM responses by providing relevant context from a vector database.
- **Language Model**: Ollama LLM - Processes the context and generates human-like answers.

## How It Works
1. **Input a YouTube URL**: The user provides the URL of a YouTube video.
2. **Video Processing**: The backend downloads the video and transcribes the audio using Whisper.
3. **Context Retrieval**: The transcription is stored in a vector database, and relevant parts of the text are fetched using RAG based on the user’s query.
4. **Question Answering**: The retrieved context is passed to Ollama LLM, which generates a response to the user’s question.
5. **Display**: The answer is displayed in the frontend for the user.

## Setup Instructions
### Backend (FASTAPI)
1. Clone the repository:
   ```bash
   git clone https://github.com/reesshhoo/ChatTube.git
   cd ChatTube
   ```
   
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the FASTAPI server:
```bash
uvicorn main:app --reload
```

### Frontend (ReactJS)
1. Navigate to the frontend directory:
```bash
cd frontend
```
2. Install frontend dependencies:
```bash
npm install
```
3.Start the React development server:
```bash
npm start
```
