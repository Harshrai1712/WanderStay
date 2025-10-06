const User = require("../models/User");
const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

const getUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            throw new Error('Authorization token not found.')
        }

        if (token) {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const userData = await User.findById(decodedToken.id);

            if (!userData) {
                throw new Error(404, "User not found.");
            }

            const { name, email, id, profilePhoto } = userData;
            console.log('getUser - User data:', { name, email, id, profilePhoto });
            res.json({ name, email, id, profilePhoto });
        } else {
            res.json(null);
        }
    } catch (error) {
        next(error);
    }
};

module.exports = getUser;
