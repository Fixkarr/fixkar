import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import redis from '../services/redisClient.js';

const getTokenKey = (token) =>
    `revoked_token:${crypto.createHash('sha256').update(token).digest('hex')}`;

export const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Logout is now server-side authoritative. Even if the browser fails
        // to remove the HttpOnly cookie, a logged-out token can never be used again.
        const isRevoked = await redis.exists(getTokenKey(token));
        if (isRevoked) {
            return res.status(401).json({ message: "Session has been logged out" });
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

export { getTokenKey };