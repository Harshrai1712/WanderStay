const User = require("../models/User");
const jwt = require("jsonwebtoken");

const updateProfile = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        const { profilePhoto } = req.body;

        if (!token) {
            throw new Error('Authorization token not found.');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePhoto },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error("User not found.");
        }

        const { name, email, id, profilePhoto: photo } = updatedUser;
        console.log('Profile updated:', { name, email, id, profilePhoto: photo });
        
        res.json({ name, email, id, profilePhoto: photo });
    } catch (error) {
        console.error('Update profile error:', error);
        next(error);
    }
};

module.exports = updateProfile;
