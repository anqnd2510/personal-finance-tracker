"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
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
        req.account = {
            accountId: decoded.accountId,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json(apiResponse_1.ApiResponse.error("Authentication failed", 401));
        return;
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=authenticate.js.map