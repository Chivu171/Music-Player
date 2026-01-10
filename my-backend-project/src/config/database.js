const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.DB_URI;

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose.connect(dbURI)
      .then(() => {
        console.log('✅ Kết nối Database thành công!');
      })
      .catch(err => {
        console.error('❌ Lỗi kết nối Database:', err);
      });
  }
}

module.exports = new Database();