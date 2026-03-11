# Muzio - Premium Full-Stack Music Streaming Platform

Muzio is a high-performance, full-stack music streaming application designed with a premium Glassmorphism aesthetic. It features real-time audio streaming, dynamic trending analytics, and a robust media management system.

## 🚀 Live Demo
- **Frontend:** [Music Player on Vercel](https://music-player-three-mauve.vercel.app/)
- **Backend API:** [Muzio API on Fly.io](https://my-backend-project.fly.dev/)

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Custom CSS with Glassmorphism & Neon Design
- **Icons:** Lucide React
- **State Management:** React Hooks & Context API

### Backend
- **Runtime:** Node.js (Express.js)
- **Database:** MongoDB (Mongoose ODM)
- **Media Storage:** Cloudinary (via Buffer streams)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express-Validator
- **Documentation:** Swagger UI

### Infrastructure
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Fly.io (Dockerized)
- **Database Hosting:** MongoDB Atlas
- **CI/CD:** GitHub Integration

---

## ✨ Key Features

- **Premium UI/UX:** Stunning dark-mode interface with glassmorphism effects, smooth micro-animations, and custom transitions.
- **Efficient Streaming:** Engineered audio streaming and media uploads using **Buffer streams**, eliminating the need for temporary server-side file storage.
- **Dynamic Trending System:** Real-time tracking of daily and weekly listen counts to generate "Trending Now" charts for both songs and artists.
- **Artist Management:** Dedicated profiles for artists, including follower tracking and automated artist-genre associations.
- **Social Interaction:** Users can follow their favorite artists and discover personalized recommendations.
- **Admin Dashboard:** Secure interface for uploading songs, managing artists, and handling metadata.
- **Smart Search:** Instant search functionality for songs, artists, and albums.

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
**Tran Chi Vu** - [LinkedIn](https://www.linkedin.com/in/chivu171) | [GitHub](https://github.com/Chivu171)

## 📄 License
This project is licensed under the MIT License.
