# DailyMart Frontend

Modern React + TypeScript frontend 

## 🚀 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **Routing**: React Router 6
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/           # Route guards
│   │   ├── layout/         # Layout components
│   │   └── product/        # Product components
│   ├── pages/
│   │   ├── auth/           # Login, Signup
│   │   ├── admin/          # Admin panel pages
│   │   └── *.tsx           # User pages
│   ├── services/           # API services
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript types
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🔧 Setup Instructions

### Prerequisites

1. Node.js 20+ installed
2. Backend API running on port 3001

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔐 Authentication

The app uses JWT authentication with:
- Access tokens stored in memory
- Refresh tokens in HTTP-only cookies
- Auto token refresh on 401 responses
- Protected route components


## 🛠️ Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3001/api
```

For development, the Vite proxy handles API requests to avoid CORS issues.
