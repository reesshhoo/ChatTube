from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from chatbot import download_media_from_youtube, transcribe_audio_with_whisper, create_embeddings, chatbot

app = FastAPI()

# CORS for your React frontend
origins = ["http://localhost:3000"]  # React frontend URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for session management
sessions = {}

class YouTubeLink(BaseModel):
    youtube_url: str

class ChatQuery(BaseModel):
    query: str
    session_id: str

@app.get("/")
async def root():
    # This will redirect to your frontend home page with an input field for YouTube URL
    return JSONResponse(status_code=200, content={"message": "Home page"})

@app.post("/start-session")
async def start_session(link: YouTubeLink):
    try:
        # Step 1: Download audio and transcribe the video
        audio_path, video_title = download_media_from_youtube(link.youtube_url)
        transcript = transcribe_audio_with_whisper(audio_path)
        
        # Step 2: Save the transcript and generate embeddings
        create_embeddings(transcript, video_title)

        # Step 3: Create a new session and return session ID
        session_id = str(uuid4())
        sessions[session_id] = video_title

        # Redirect to the chatbot page with session ID
        return JSONResponse(status_code=200, content={"message": "Session started", "session_id": session_id})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def ask_chatbot(chat_data: ChatQuery):
    try:
        # Retrieve video title from session using session_id
        video_title = sessions.get(chat_data.session_id)

        if not video_title:
            raise HTTPException(status_code=404, detail="Session not found")

        # Run the chatbot function and return a response
        response = chatbot(chat_data.query, video_title)
        return JSONResponse(status_code=200, content={"response": response['message']['content']})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @app.post("/end-session")
# async def end_session(data: dict):
#     try:
#         session_id = data.get("session_id")  # Extract the session_id from the request data

#         # Proceed with ending the session as usual
#         if session_id in sessions:
#             del sessions[session_id]

#         return RedirectResponse(url="/", status_code=302)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

@app.post("/end-session")
async def end_session(data: dict):
    try:
        session_id = data.get("session_id")  # Extract the session_id from the request data

        # Proceed with ending the session as usual
        if session_id in sessions:
            del sessions[session_id]

        # Return a simple JSON response with status code 200
        return JSONResponse(status_code=200, content={"message": "Session ended successfully"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

