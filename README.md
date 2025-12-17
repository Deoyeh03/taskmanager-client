# TaskMaster Frontend 🎨

The premium, high-performance web dashboard for TaskMaster. Built with Next.js 15, React, and Tailwind CSS.

## 🌟 Visual Gems
- **Glassmorphism UI**: Stunning translucent cards and backgrounds.
- **Micro-animations**: Powered by Framer Motion for a fluid user experience.
- **Theme Support**: Full Dark/Light mode synchronization.
- **Responsive**: Fully optimized for Desktop, Tablet, and Mobile.

## 📋 Features
- **Intelligent Dashboard**: Live statistics, urgent task previews, and team activity feeds.
- **Effortless Task Management**: Drag-and-drop-like simplicity with powerful filters and search.
- **Collaborative**: Real-time task assignment and threaded commenting system.
- **Profile Customization**: Live bio and avatar updates with instant synchronization.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables (see `.env.example`).
3. Run in development:
   ```bash
   npm run dev
   ```

## 🌍 Deployment (Vercel)

Vercel is the recommended hosting platform for this Next.js application.

### 1. Link GitHub Repository
Connect your GitHub account to Vercel and import the `taskmanager-client` repository.

### 2. Configure Environment Variables
Add the following in the Vercel Dashboard under **Project Settings > Environment Variables**:
- `NEXT_PUBLIC_API_URL`: Your Backend URL on Render (e.g., `https://taskmanager-server.onrender.com/api`)
- `NEXT_PUBLIC_SOCKET_URL`: Your Backend URL on Render (e.g., `https://taskmanager-server.onrender.com`)

### 3. Deploy
Vercel will automatically detect Next.js and build the project. Ensure your Backend CORS settings include your new Vercel domain.

## 🛠️ Architecture
- **Framework**: Next.js (App Router)
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS & Lucide React
- **Authentication**: Custom Context-based session management
- **Real-time**: Socket.io-client
