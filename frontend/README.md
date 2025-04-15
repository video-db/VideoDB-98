# Windows Media Explorer Frontend

The frontend component of the Windows Media Explorer application, built with React and styled to replicate the classic Windows 95/98 interface.

## Features

- Authentic Windows 95/98 desktop environment
- File Explorer with customizable views
- Media player with video playback controls
- Context menus for file operations
- Transcript and scene viewing capabilities
- Search functionality
- Real-time video indexing status

## Tech Stack

- React 18+
- TypeScript
- Styled Components
- 98.css for Windows 98 styling
- React Contexify for context menus
- React Draggable for window management
- React Player for media playback

## Directory Structure

```
frontend/
├── src/
│   ├── assets/      # Icons, images, and static resources
│   ├── components/  # Reusable React components
│   ├── contexts/    # React context providers
│   ├── hooks/       # Custom React hooks
│   ├── pages/       # Page components
│   ├── services/    # API and service integrations
│   ├── styles/      # Global styles and themes
│   └── utils/       # Helper functions and utilities
├── public/          # Static files
└── package.json     # Project dependencies and scripts
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm start` - Run the development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Development Guidelines

- Follow the established component structure
- Use TypeScript for type safety
- Maintain Windows 95/98 design consistency
- Write unit tests for new components
- Follow the established naming conventions

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request
4. Ensure all tests pass
5. Request code review

## Related Documentation

- [Backend API Documentation](../backend/README.md)
- [Project Overview](../README.md)
