import os
import subprocess
import re
import ollama
from pytube import YouTube
import whisper
from qdrant_client import QdrantClient
from qdrant_client.http import models
from sentence_transformers import SentenceTransformer
from langchain_text_splitters import RecursiveCharacterTextSplitter

def sanitize_filename(title):
    return re.sub(r'[^a-zA-Z0-9]', '_', title)

def download_media_from_youtube(youtube_url, download_path=".", ffmpeg_path="/usr/bin/ffmpeg"):
    yt = YouTube(youtube_url)
    video_title = sanitize_filename(yt.title)
    audio_output_file = os.path.join(download_path, f"{video_title}_audio.mp3")

    # Download audio
    audio_command = [
        'yt-dlp',
        '-x',  # Extract audio only
        '--audio-format', 'mp3',
        '--ffmpeg-location', ffmpeg_path,
        '-o', audio_output_file,
        youtube_url
    ]
    subprocess.run(audio_command, check=True)

    return audio_output_file, video_title  # Return video title as well

def transcribe_audio_with_whisper(audio_file, model_size="base", language="English"):
    # Command to run Whisper for transcription
    model = whisper.load_model('base')

    result = model.transcribe(audio_file)
    return result["text"]

client = QdrantClient(url="http://localhost:6333")
model = SentenceTransformer('all-MiniLM-L6-v2')

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=150,
    chunk_overlap=20,
    length_function=len,
    is_separator_regex=False,
)

def create_embeddings(transcript, video_title):
    docs = text_splitter.create_documents([transcript])

    embeddings = []
    for i in docs:
        embedding = model.encode(i.page_content)
        embeddings.append(embedding.tolist())

    collection_name = video_title

    collections = client.get_collections()
    collection_exists = any(existing_collection.name == collection_name for existing_collection in collections.collections)

    if not collection_exists:
        embedding_size = len(embeddings[0])
        client.create_collection(
            collection_name=collection_name,
            vectors_config=models.VectorParams(
                size=embedding_size,
                distance=models.Distance.COSINE
            )
        )

    for index, embedding in enumerate(embeddings):
        point = models.PointStruct(id=index + 1, vector=embedding, payload={"context": docs[index].page_content})
        client.upsert(
            collection_name=collection_name,
            wait=True,
            points=[point]
        )

def search(query, collection_name):
    query_embedding = model.encode(query).tolist()
    
    search_results = client.search(
        collection_name=collection_name,
        query_vector=query_embedding,
        limit=8
    )

    relevant_contexts = [result.payload['context'] for result in search_results]
    return relevant_contexts

def generate_response(query, context):
    prompt = f"""You are a helpful Q&A assistant. Below is some context information from the transcript of a video lecture. You shall answer the user's query based on this context.:

Context:
{context}

User's query: {query}

Based on the given context, give an appropriate answer to the user's query. In case, you do not have an appropriate answer just say that the given context is not enough to generate an appropriate answer. Do not generate any random answer. 
"""
    response = ollama.chat(model='qwen2.5', messages=[{'role': 'user', 'content': prompt}])
    return response

def chatbot(query, collection_name):
    context = search(query, collection_name)
    
    if context:
        response = generate_response(query, context)
        return response
    else:
        return {"message": {"content": "I'm sorry, I couldn't find any relevant information for your query."}}
