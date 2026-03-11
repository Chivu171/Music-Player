# Muzio - Premium Full-Stack Music Streaming Platform

Muzio is a high-performance, full-stack music streaming application designed with a premium Glassmorphism aesthetic. It features real-time audio streaming, dynamic trending analytics, and a robust media management system.

## 🚀 Live Demo
- **Frontend:** [Music Player on Vercel](https://music-player-three-mauve.vercel.app/)
- **Backend API:** [Muzio API on Fly.io](https://my-backend-project.fly.dev/)

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **State Management:** TanStack Query (React Query v5) & React Hooks
- **Build Tool:** Vite
- **Styling:** Custom CSS with Glassmorphism & Neon Design
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js (Express.js)
- **Database:** MongoDB (Mongoose ODM)
- **Caching:** Redis (Performance Layer)
- **Media Storage:** Cloudinary (via Buffer streams)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express-Validator
- **Documentation:** Swagger UI

### Infrastructure
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Fly.io (Dockerized)
- **Database Hosting:** MongoDB Atlas
- **Caching Layer:** Upstash Redis / Local Redis
- **CI/CD:** GitHub Integration

---

## ✨ Key Features

- **Premium UI/UX:** Stunning dark-mode interface with glassmorphism effects, smooth micro-animations, and custom transitions.
- **Dual-Layer Caching System:** 
    - **Frontend:** Implemented **React Query** for instant UI responses, background data synchronization, and zero-latency navigation.
    - **Backend:** Integrated **Redis** to cache heavy database queries (Playlists, Albums), reducing response times by up to 90%.
- **Efficient Streaming:** Engineered audio streaming and media uploads using **Buffer streams**, eliminating temporary server-side disk usage.
- **Dynamic Trending System:** Real-time tracking of daily/weekly listen counts to generate live "Trending Now" charts.
- **Artist Management:** Dedicated profiles with follower tracking and automated metadata associations.
- **Social Interaction:** Follow artists and discover personalized recommendations.
- **Admin Dashboard:** Secure interface for media uploads and library management.
- **Smart Search:** High-performance search with client-side caching for instant results.

---

## 🏗 System Architecture (High Level)

### Media Processing Flow
Unlike traditional implementations that save files temporarily to the server disk, Muzio uses a **Pro-stream workflow**:
1. User uploads media via Frontend.
2. Backend receives file as a **Buffer**.
3. Buffer is piped directly to **Cloudinary** using a dedicated stream upload helper.
4. Benefits: Faster uploads, lower memory usage, and zero disk overhead.

---

## ⚙️ Local Setup

### Prerequisites
- Node.js (v18+)
- Docker (for local MongoDB)
- Cloudinary Account

### 1. Clone the repository
```bash
git clone https://github.com/Chivu171/Music-Player.git
cd Music-Player
```

### 2. Backend Setup
```bash
cd my-backend-project
npm install
# Create .env file based on .env.example
npm run dev
```

### 3. Frontend Setup
```bash
cd my-fe-prj
npm install
# Set VITE_API_URL=http://localhost:8000 in .env
npm run dev
```

---

## 📝 Author
**Tran Chi Vu** - [LinkedIn](https://www.linkedin.com/in/tran-vu-190809282/) | [GitHub](https://github.com/Chivu171)

## 📄 License
This project is licensed under the MIT License.
