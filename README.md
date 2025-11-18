# ATMS - Automated Traffic Management System

A modern, static React frontend built from Figma design specifications for managing traffic infrastructure and monitoring traffic flow.

## Overview

This is the static implementation of the ATMS dashboard. It includes all UI components and pages as designed in Figma, ready for API integration.

## Features

- **Dashboard**: Overview of system status with key metrics and recent activity
- **Resource Management**: Comprehensive device management with filtering and search
- **Resource Control**: Device control panels for VDS, SS, VMS, RTMS, and facility devices
- **Road Event Management**: Track and manage traffic incidents and events
- **History Inquiry**: Search and view historical system logs
- **Traffic Statistics**: Visualize traffic patterns and analytics

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Top navigation bar
│   ├── Sidebar.tsx     # Left sidebar navigation
│   ├── Card.tsx        # Card container
│   ├── Table.tsx       # Data table
│   ├── StatusBadge.tsx # Status indicators
│   ├── Button.tsx      # Button component
│   ├── Input.tsx       # Input fields
│   └── MegaMenu.tsx    # Mega menu dropdown
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── ResourceManagement.tsx
│   ├── ResourceControl.tsx
│   ├── RoadEvents.tsx
│   ├── HistoryInquiry.tsx
│   └── TrafficStats.tsx
├── layouts/            # Layout components
│   └── MainLayout.tsx  # Main app layout
├── styles/             # Style tokens
│   ├── colors.ts       # Color palette
│   └── typography.ts   # Typography styles
└── assets/             # Static assets
    └── icons/          # SVG icons from Figma
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)

### Installation

#### Option 1: Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

#### Option 2: Docker (Recommended for Production)

**Production Build:**
```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Or using Docker directly
docker build -t atms-frontend .
docker run -d -p 3000:80 --name atms-frontend atms-frontend
```

The app will be available at `http://localhost:3000`

**Development with Hot Reload:**
```bash
# Start development container
docker-compose -f docker-compose.dev.yml up
```

The development server will be available at `http://localhost:5173`

For detailed Docker instructions, see [DOCKER.md](./DOCKER.md)

## Available Routes

- `/` or `/dashboard` - Dashboard homepage
- `/resource-management` - Device management
- `/resource-control` - Device control panels
- `/road-events` - Event management
- `/history` - History inquiry
- `/traffic-stats` - Traffic statistics

## Design System

### Colors

The color palette is extracted from the Figma design:

- **Primary**: `#3758F9` - Main brand color
- **Dark**: `#111928` - Primary text
- **Gray**: `#F9FAFB` - Background
- **Status Colors**: Green (Active), Orange (Wait), Grey (Offline)

### Typography

- **Font Family**: Inter
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### Components

All components follow the Figma specifications with:
- Consistent spacing (using Tailwind's spacing scale)
- Proper shadows and borders
- Hover and active states
- Responsive design

## Static Data

All data is currently static/mocked. When integrating with APIs:

1. Replace static data arrays with API calls
2. Add loading states
3. Add error handling
4. Implement real-time updates where needed

## Next Steps

- [ ] Integrate REST/GraphQL APIs
- [ ] Add authentication and authorization
- [ ] Implement real-time data updates (WebSocket/SSE)
- [ ] Add form validation
- [ ] Implement data persistence
- [ ] Add unit and integration tests
- [ ] Optimize performance
- [ ] Add accessibility features

## Development

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use Tailwind utility classes for styling

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## License

Copyright © 2024 ATMS. All rights reserved.
