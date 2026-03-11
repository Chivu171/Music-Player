// Nạp biến môi trường (phải ở trên cùng)
require('dotenv').config();

const express = require('express');

// Tự động kết nối đến database khi server khởi động
require('./src/infrastructure/config/database');

// Khởi tạo ứng dụng web
const app = express();
const port = process.env.PORT || 8000;

// Initialize Scheduled Tasks (Cron Jobs)
const { initCronJobs } = require('./src/infrastructure/config/cron');
initCronJobs();
const { connectRedis } = require('./src/infrastructure/config/redis');
connectRedis();

// Swagger documentation
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/infrastructure/config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const songRoute = require('./src/domains/song/song.routes');
const userRoute = require('./src/domains/auth/auth.routes');
const streamRoute = require('./src/domains/song/stream.routes');
const playlistRoute = require('./src/domains/playlist/playlist.routes');
const artistRoute = require('./src/domains/artist/artist.routes');
const genresRoute = require('./src/domains/genre/genre.routes');
const uploadRoute = require("./src/domains/song/upload.routes");
const cors = require('cors'); // <-- 1. IMPORT THƯ VIỆN



// Middleware để đọc JSON từ request body
app.use(express.json());

// Cấu hình CORS
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'http://localhost:3000',
  /\.vercel\.app$/        // All Vercel deployments
];

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép các request không có origin (như mobile apps hoặc curl)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) return allowed.test(origin);
      return allowed === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`❌ CORS Blocked for origin: ${origin}`);
      callback(new Error('Cross-Origin Request Blocked by CORS'));
    }
  },
  credentials: true
}));


// Một API endpoint đơn giản để kiểm tra
app.get('/', (req, res) => {
  res.send('Server Backend đang chạy!');
});

app.use('/api/songs', songRoute);
app.use('/api/auth', userRoute);
app.use('/api/stream', streamRoute);
app.use('/api/playlists', playlistRoute);
app.use('/api/artists', artistRoute);
app.use('/api/genres', genresRoute);
app.use("/api/upload", uploadRoute);

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang lắng nghe tại http://localhost:${port}`);
});