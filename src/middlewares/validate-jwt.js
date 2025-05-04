import jwt from "jsonwebtoken"
import User from "../user/user.model.js"

export const validateJWT = async (req, res, next) => {
    try {

        let token = req.headers["authorization"] || req.query.token || req.body?.token;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "There is no token in the request"
            });
        }

        token = token.replace(/^Bearer\s+/, "");

        const { uid } = jwt.verify(token, process.env.SECRETKEY);

        const user = await User.findById(uid);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.status === false) {
            return res.status(400).json({
                success: false,
                message: "Previously deactivated user"
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error validating token (expired or invalid)",
            error: err.message
        });
    }
};
