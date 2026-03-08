const StreamService = require('./stream.service');

const streamSong = async (req, res) => {
  try {
    const songID = req.params.id;

    // Lấy URL bài hát từ Service (nó trả về result.secure_url từ Cloudinary)
    const fileUrl = await StreamService.getSongPathById(songID);

    if (!fileUrl) {
      return res.status(404).send('Song URL not found');
    }

    // Chuyển hướng trình duyệt/ứng dụng sang link Cloudinary
    // Cloudinary sẽ tự động xử lý việc Stream dữ liệu và cho phép tua nhạc (Seek)
    res.redirect(fileUrl);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { streamSong };