import jwt from 'jsonwebtoken';

export const isAuth = (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.userId) {
            return res.status(401).json({
                message: "Token not verified"
            });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Authentication error:", error?.message || error);
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};