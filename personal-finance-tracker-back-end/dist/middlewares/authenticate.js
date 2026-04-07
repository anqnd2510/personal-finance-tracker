"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const jwt_1 = require("../utils/jwt");
const redis_1 = require("../config/redis");
const authenticate = (req, res, next) => {
    const processAuth = async () => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(401).json(apiResponse_1.ApiResponse.error("Access token is required", 401));
                return;
            }
            const token = authHeader.substring(7);
            const decoded = jwt_1.JWTService.verifyToken(token);
            if (!decoded) {
                res.status(401).json(apiResponse_1.ApiResponse.error("Invalid or expired token", 401));
                return;
            }
            if (!decoded.sessionId) {
                res.status(401).json(apiResponse_1.ApiResponse.error("Invalid token session", 401));
                return;
            }
            try {
                const redis = (0, redis_1.getRedisClient)();
                const activeSessionId = await redis.get(`auth:session:${decoded.accountId}`);
                if (!activeSessionId || activeSessionId !== decoded.sessionId) {
                    res
                        .status(401)
                        .json(apiResponse_1.ApiResponse.error("Session expired. Please login again", 401));
                    return;
                }
            }
            catch (error) {
                console.error("Session validation failed due to Redis error:", error);
                res
                    .status(503)
                    .json(apiResponse_1.ApiResponse.error("Authentication service unavailable", 503));
                return;
            }
            req.account = {
                accountId: decoded.accountId,
                email: decoded.email,
                role: decoded.role,
                sessionId: decoded.sessionId,
            };
            next();
        }
        catch (error) {
            console.error("Authentication error:", error);
            res.status(401).json(apiResponse_1.ApiResponse.error("Authentication failed", 401));
            return;
        }
    };
    void processAuth();
};
exports.authenticate = authenticate;
//# sourceMappingURL=authenticate.js.map