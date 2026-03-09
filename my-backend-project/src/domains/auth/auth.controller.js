const UserService = require('./auth.service')
const { cloudinary } = require('../../infrastructure/middleware/uploadMiddleware');
const streamifier = require('streamifier');



const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please fill in the form completely' })
        }
        const newUser = await UserService.registerUser({ username, email, password })
        res.status(200).json({ message: 'Succefully registered', user: newUser })
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill in the form completely' })
        }
        const result = await UserService.loginUser({ email, password });
        res.status(200).json({ message: 'Login successful', ...result })

    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }
        const newAccessToken = await UserService.refreshAccessToken(refreshToken);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}
const getMe = async (req, res) => {
    try {
        // req.user.id được middleware isAuthenticated gắn vào từ Token
        const userId = req.user.id;
        const user = await UserService.getMe(userId);
        res.status(200).json({
            message: 'User profile fetched successfully',
            user: user
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!newPassword || !oldPassword) {
            return res.status(400).json({ message: 'Please provide both old and new passwords' })

        }
        const result = await UserService.changePassword(req.user.id, oldPassword, newPassword);
        res.status(200).json(result);


    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
const updateProfile = async (req, res) => {
    try {
        const updateData = req.body;
        const updatedUser = await UserService.updateProfile(req.user.id, updateData);
        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });

    }
}

const likeSong = async (req, res) => {
    try {
        const songId = req.params.songId;
        const user = await UserService.likeSong(req.user.id, songId);
        res.status(200).json({ message: 'Song liked', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const unlikeSong = async (req, res) => {
    try {
        const songId = req.params.songId;
        const user = await UserService.unlikeSong(req.user.id, songId);
        res.status(200).json({ message: 'Song unliked', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getLikedSongs = async (req, res) => {
    try {
        const songs = await UserService.getLikedSongs(req.user.id);
        res.status(200).json(songs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const addToHistory = async (req, res) => {
    try {
        const songId = req.params.songId;
        const user = await UserService.addToHistory(req.user.id, songId);
        res.status(200).json({ message: 'Added to history', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getHistory = async (req, res) => {
    try {
        const history = await UserService.getHistory(req.user.id);
        res.status(200).json(history);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        // Tạo hàm upload stream lên Cloudinary
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    { folder: "music-player-avatars" },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const result = await streamUpload(req);

        // Cập nhật URL avatar vào profile user
        const updatedUser = await UserService.updateProfile(req.user.id, { avatar: result.secure_url });

        res.status(200).json({
            message: 'Avatar uploaded successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const followArtist = async (req, res) => {
    try {
        const artistId = req.params.artistId;
        const user = await UserService.followArtist(req.user.id, artistId);
        res.status(200).json({ message: 'Artist followed', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const unfollowArtist = async (req, res) => {
    try {
        const artistId = req.params.artistId;
        const user = await UserService.unfollowArtist(req.user.id, artistId);
        res.status(200).json({ message: 'Artist unfollowed', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getFollowedArtists = async (req, res) => {
    try {
        const artists = await UserService.getFollowedArtists(req.user.id);
        res.status(200).json(artists);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { register, login, refreshToken, getMe, changePassword, updateProfile, likeSong, unlikeSong, getLikedSongs, addToHistory, getHistory, uploadAvatar, followArtist, unfollowArtist, getFollowedArtists };