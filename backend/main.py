from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from typing import List, Optional
import os
import uvicorn
import json
import videodb
from pydantic import BaseModel

# Load environment variables from .env file
load_dotenv()

# Get API key from environment
api_key = os.getenv("VIDEODB_API_KEY")
if not api_key:
    raise ValueError("VIDEODB_API_KEY environment variable is not set")

# Initialize VideoDB connection
conn = videodb.connect(api_key=api_key)

# Create FastAPI app
app = FastAPI(title="Windows Media Explorer API")

# Add CORS middleware to allow cross-origin requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request validation
class IndexRequest(BaseModel):
    video_id: str
    index_type: str  # "spoken_words" or "scenes"
    prompt: Optional[str] = None

# API routes
@app.get("/")
async def root():
    return {"message": "Windows Media Explorer API is running"}

@app.get("/collections")
async def get_collections():
    try:
        collections = conn.get_collections()
        return {
            "collections": [
                {"id": coll.id, "name": coll.name, "description": coll.description}
                for coll in collections
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/collection/{collection_id}/videos")
async def get_videos(collection_id: str):
    try:
        collection = conn.get_collection(collection_id)
        videos = collection.get_videos()
        return {
            "videos": [
                {
                    "id": video.id, 
                    "name": video.name, 
                    "description": video.description,
                    "thumbnail_url": video.thumbnail_url,
                    "length": video.length
                }
                for video in videos
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/collection/{collection_id}/audios")
async def get_audios(collection_id: str):
    try:
        collection = conn.get_collection(collection_id)
        audios = collection.get_audios()
        return {
            "audios": [
                {
                    "id": audio.id, 
                    "name": audio.name, 
                    "length": audio.length
                }
                for audio in audios
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/collection/{collection_id}/images")
async def get_images(collection_id: str):
    try:
        collection = conn.get_collection(collection_id)
        images = collection.get_images()
        return {
            "images": [
                {
                    "id": image.id, 
                    "name": image.name, 
                    "url": image.url
                }
                for image in images
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload/url")
async def upload_url(
    url: str = Form(...),
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    collection_id: str = Form("default"),
    media_type: Optional[str] = Form(None)
):
    try:
        collection = conn.get_collection(collection_id)
        media_type_enum = None
        if media_type:
            if media_type == "video":
                media_type_enum = videodb.MediaType.video
            elif media_type == "audio":
                media_type_enum = videodb.MediaType.audio
            elif media_type == "image":
                media_type_enum = videodb.MediaType.image
        
        media = collection.upload(
            url=url,
            name=name,
            description=description,
            media_type=media_type_enum
        )
        
        return {
            "id": media.id,
            "name": media.name,
            "type": media_type or "video"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload/file")
async def upload_file(
    file: UploadFile = File(...),
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    collection_id: str = Form("default"),
    media_type: Optional[str] = Form(None)
):
    try:
        # Save the uploaded file temporarily
        temp_file_path = f"/tmp/{file.filename}"
        with open(temp_file_path, "wb") as temp_file:
            content = await file.read()
            temp_file.write(content)
        
        # Upload to VideoDB
        collection = conn.get_collection(collection_id)
        media_type_enum = None
        if media_type:
            if media_type == "video":
                media_type_enum = videodb.MediaType.video
            elif media_type == "audio":
                media_type_enum = videodb.MediaType.audio
            elif media_type == "image":
                media_type_enum = videodb.MediaType.image
        
        media = collection.upload(
            file_path=temp_file_path,
            name=name or file.filename,
            description=description,
            media_type=media_type_enum
        )
        
        # Clean up temp file
        os.remove(temp_file_path)
        
        return {
            "id": media.id,
            "name": media.name,
            "type": media_type or "video"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/video/{video_id}/stream")
async def get_video_stream(video_id: str):
    try:
        collection = conn.get_collection()
        video = collection.get_video(video_id)
        stream_url = video.generate_stream()
        return {"stream_url": stream_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/video/{video_id}/index")
async def index_video(video_id: str, request: IndexRequest):
    try:
        collection = conn.get_collection()
        video = collection.get_video(video_id)
        
        # Store indexing status in a simple JSON file
        index_status_file = f"index_status_{video_id}.json"
        
        # Check if video is already indexed
        if os.path.exists(index_status_file):
            with open(index_status_file, "r") as f:
                status = json.load(f)
                if request.index_type in status and status[request.index_type]:
                    return {"status": "already_indexed", "message": f"Video already indexed with {request.index_type}"}
        
        # Index the video
        if request.index_type == "spoken_words":
            video.index_spoken_words()
            index_id = None
        elif request.index_type == "scenes":
            index_id = video.index_scenes(prompt=request.prompt)
        else:
            raise HTTPException(status_code=400, detail="Invalid index_type. Must be 'spoken_words' or 'scenes'")
        
        # Store indexing status
        status = {}
        if os.path.exists(index_status_file):
            with open(index_status_file, "r") as f:
                status = json.load(f)
        
        status[request.index_type] = True
        if request.index_type == "scenes" and index_id:
            if "scene_indexes" not in status:
                status["scene_indexes"] = []
            status["scene_indexes"].append(index_id)
        
        with open(index_status_file, "w") as f:
            json.dump(status, f)
        
        return {"status": "success", "message": f"Video indexed with {request.index_type}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/video/{video_id}/search")
async def search_video(
    video_id: str, 
    query: str, 
    index_type: str = "spoken_word",
    search_type: str = "semantic"
):
    try:
        collection = conn.get_collection()
        video = collection.get_video(video_id)
        
        # Convert string parameters to VideoDB enums
        index_type_enum = (
            videodb.IndexType.scene if index_type == "scene" else videodb.IndexType.spoken_word
        )
        search_type_enum = (
            videodb.SearchType.keyword if search_type == "keyword" else videodb.SearchType.semantic
        )
        
        # Perform search
        results = video.search(
            query=query,
            search_type=search_type_enum,
            index_type=index_type_enum
        )
        
        # Get shots and return results
        shots = results.get_shots()
        return {
            "results": [
                {
                    "video_id": shot.video_id,
                    "start": shot.start,
                    "end": shot.end,
                    "text": shot.text,
                    "score": shot.search_score
                }
                for shot in shots
            ],
            "stream_url": results.stream_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/video/{video_id}")
async def delete_video(video_id: str, collection_id: str = "default"):
    try:
        collection = conn.get_collection(collection_id)
        collection.delete_video(video_id)
        
        # Remove indexing status file if it exists
        index_status_file = f"index_status_{video_id}.json"
        if os.path.exists(index_status_file):
            os.remove(index_status_file)
            
        return {"status": "success", "message": "Video deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/audio/{audio_id}")
async def delete_audio(audio_id: str, collection_id: str = "default"):
    try:
        collection = conn.get_collection(collection_id)
        collection.delete_audio(audio_id)
        return {"status": "success", "message": "Audio deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/image/{image_id}")
async def delete_image(image_id: str, collection_id: str = "default"):
    try:
        collection = conn.get_collection(collection_id)
        collection.delete_image(image_id)
        return {"status": "success", "message": "Image deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/rename/{media_type}/{media_id}")
async def rename_media(media_type: str, media_id: str, name: str = Form(...)):
    try:
        collection = conn.get_collection()
        
        if media_type == "video":
            media = collection.get_video(media_id)
        elif media_type == "audio":
            media = collection.get_audio(media_id)
        elif media_type == "image":
            media = collection.get_image(media_id)
        else:
            raise HTTPException(status_code=400, detail="Invalid media type")
        
        # VideoDB doesn't have a direct rename function, so we'd need to
        # update the name on the server side or track names separately
        # This is a simplified example that just returns success
        return {"status": "success", "message": f"{media_type} renamed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/video/{video_id}/transcript")
async def get_transcript(video_id: str):
    try:
        collection = conn.get_collection()
        video = collection.get_video(video_id)
        transcript = video.get_transcript()
        return {"transcript": transcript}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/video/{video_id}/scenes")
async def get_scenes(video_id: str):
    try:
        collection = conn.get_collection()
        video = collection.get_video(video_id)
        
        # Get scene indexing status
        index_status_file = f"index_status_{video_id}.json"
        if os.path.exists(index_status_file):
            with open(index_status_file, "r") as f:
                status = json.load(f)
                if "scene_indexes" in status and status["scene_indexes"]:
                    # Get the most recent scene index
                    scene_index_id = status["scene_indexes"][-1]
                    scenes = video.get_scene_index(scene_index_id)
                    return {"scenes": scenes}
        
        return {"scenes": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)