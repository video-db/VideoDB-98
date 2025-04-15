# Windows Media Explorer

A nostalgic Windows 95/98-style media explorer application for browsing, managing, and interacting with video content through VideoDB.

![Windows Media Explorer Screenshot](https://github.com/user-attachments/assets/af16b5dc-971f-4dc3-8761-2516c5956455)


## Overview

Windows Media Explorer combines the classic Windows 95/98 interface with modern video processing capabilities. It provides a familiar, retro-styled environment for managing and interacting with video content, powered by VideoDB's advanced video processing features.

## ⚠️ Disclaimer

This project is currently in an experimental state and was developed as a "vibe coding" project with the assistance of [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview). As such:

- The code may contain bugs and unexpected behaviors
- Some features might be incomplete or work inconsistently
- This is more of a proof-of-concept than a production-ready application

## Features

- 🖥️ Classic Windows desktop interface with authentic UI elements
- 📁 File Explorer windows with different views for video, audio, and image content
- 🖱️ Context menus with right-click functionality
- 🎥 Media player with video playback controls
- 📝 Transcript and scene viewing capabilities
- 🔍 Search functionality within video content
- 📊 On-demand indexing for video content
- 🎨 Windows 95/98 visual styling
- 🔄 Real-time video processing status

## Technology Stack

### Frontend
- React (with TypeScript)
- Styled Components
- React Contexify (context menus)
- React Draggable (window dragging)
- React Player (media playback)
- 98.css (Windows 98 styling)

### Backend
- FastAPI
- VideoDB SDK
- Python 3.10+
- uvicorn

## Quick Start

### Prerequisites

- Node.js 16 or higher
- Python 3.10 or higher
- VideoDB API key ([Get one here](https://console.videodb.io/))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/windows-media-explorer.git
   cd windows-media-explorer
   ```

2. Set up the backend:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env and add your VideoDB API key
   ```

3. Start the backend server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

5. Open your browser and navigate to http://localhost:3000

## Project Structure

```
windows-media-explorer/
├── frontend/           # React frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── README.md      # Frontend documentation
├── backend/           # FastAPI backend service
│   ├── main.py       # Main application
│   └── README.md     # Backend documentation
└── README.md         # Project documentation
```

## Documentation

- [Frontend Documentation](frontend/README.md)
- [Backend Documentation](backend/README.md)
- [API Documentation](backend/README.md#api-endpoints)
- [VideoDB SDK Documentation](https://docs.videodb.io)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [VideoDB](https://videodb.io) for video processing capabilities
- [98.css](https://jdan.github.io/98.css/) for Windows 98 styling
- [React](https://reactjs.org) and [FastAPI](https://fastapi.tiangolo.com) communities
