// Nạp biến môi trường (phải ở trên cùng)
require('dotenv').config();

const express = require('express');

// Tự động kết nối đến database khi server khởi động
require('./src/config/database');

// Khởi tạo ứng dụng web
const app = express();
const port = process.env.PORT || 3000;

// Swagger documentation
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
const songRoute = require('./src/routes/SongRoute');
const userRoute = require('./src/routes/UserRoute');
const streamRoute = require('./src/routes/StreamRoute');
const playlistRoute = require('./src/routes/PlayListRoute');
const artistRoute = require('./src/routes/ArtistRoute');
const genresRoute = require('./src/routes/GenreRoute');
const uploadRoute = require("./src/routes/upload");
const cors = require('cors'); // <-- 1. IMPORT THƯ VIỆN



// Middleware để đọc JSON từ request body
app.use(express.json());
app.use(cors()); // <-- DÒNG QUAN TRỌNG NHẤT


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
app.use("/upload", uploadRoute);

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang lắng nghe tại http://localhost:${port}`);
});