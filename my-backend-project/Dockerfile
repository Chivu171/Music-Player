# Sử dụng Node.js image chính thức
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 8000 (theo PORT=.env)
EXPOSE 8000

# Lệnh khởi chạy server (dùng node app.js cho production-like)
CMD ["npm", "start"]
