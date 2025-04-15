# Windows Media Explorer Backend

The backend service for Windows Media Explorer, built with FastAPI and VideoDB SDK to handle video processing, indexing, and media management.

## Features

- Video content management and processing
- Integration with VideoDB for video operations
- RESTful API endpoints for frontend communication
- Video indexing and search capabilities
- Transcript generation and management
- Scene detection and analysis
- Media file operations

## Tech Stack

- Python 3.10+
- FastAPI
- VideoDB SDK
- uvicorn (ASGI server)
- python-dotenv for environment management

## Directory Structure

```
backend/
├── main.py              # Main application entry point
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (not in VCS)
├── .env.example         # Example environment configuration
└── pyproject.toml      # Project configuration
```

## Prerequisites

- Python 3.10 or higher
- VideoDB API key (obtain from [VideoDB Console](https://console.videodb.io/))
- Virtual environment tool (venv, conda, etc.)

## Getting Started

1. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your VideoDB API key
   ```

4. Start the development server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

- `GET /api/videos` - List all videos
- `POST /api/videos/index` - Index a video
- `GET /api/videos/{video_id}` - Get video details
- `GET /api/videos/{video_id}/transcript` - Get video transcript
- `GET /api/videos/{video_id}/scenes` - Get video scenes
- `POST /api/search` - Search video content

## Environment Variables

- `VIDEODB_API_KEY` - Your VideoDB API key
- `DEBUG` - Enable debug mode (default: False)
- `CORS_ORIGINS` - Allowed CORS origins
- `PORT` - Server port (default: 8000)

## Development Guidelines

- Follow PEP 8 style guide
- Use type hints for all functions
- Write docstrings for functions and classes
- Add tests for new features
- Keep the API documentation updated

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Contributing

1. Create a virtual environment and install dependencies
2. Make your changes
3. Run tests
4. Submit a pull request

## Related Documentation

- [Frontend Documentation](../frontend/README.md)
- [Project Overview](../README.md)
- [VideoDB SDK Documentation](https://docs.videodb.io)
