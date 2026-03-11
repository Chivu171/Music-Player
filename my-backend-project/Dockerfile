# Sử dụng Node.js image chính thức
FROM node:18-slim

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Thiết lập biến môi trường production
ENV NODE_ENV=production

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt dependencies (chỉ production)
RUN npm install --only=production

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 8000
EXPOSE 8000

# Lệnh khởi chạy server
CMD ["node", "app.js"]
