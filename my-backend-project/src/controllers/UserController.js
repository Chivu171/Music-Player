const UserService = require('../services/UserService')


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
        res.status(200).json({ message: 'Succefully login', user: result })

    }
    catch (error) {
        return res.status(400).json({ message: error.message });
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

module.exports = { register, login, getMe, changePassword, updateProfile }