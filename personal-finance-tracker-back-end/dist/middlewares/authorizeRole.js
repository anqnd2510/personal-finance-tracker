"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoleHierarchy = exports.authorizeRole = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const role_1 = require("../constants/role");
const authorizeRole = (requiredRoles) => {
    return (req, res, next) => {
        const accountRole = req.account?.role;
        if (!accountRole) {
            res
                .status(401)
                .json(apiResponse_1.ApiResponse.error("Forbidden: You do not have permission to access this resource", 401));
            return;
        }
        const hasPermission = requiredRoles.some((role) => accountRole === role);
        if (!hasPermission) {
            res.status(403).json(apiResponse_1.ApiResponse.error("Insufficient permissions", 403));
            return;
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
const authorizeRoleHierarchy = (minimumRole) => {
    return (req, res, next) => {
        const accountRole = req.account?.role;
        if (!accountRole) {
            res.status(401).json(apiResponse_1.ApiResponse.error("Authentication required", 401));
            return;
        }
        const userRoleLevel = role_1.RoleHierarchy[accountRole];
        const requiredRoleLevel = role_1.RoleHierarchy[minimumRole];
        if (userRoleLevel < requiredRoleLevel) {
            res.status(403).json(apiResponse_1.ApiResponse.error("Insufficient permissions", 403));
            return;
        }
        next();
    };
};
exports.authorizeRoleHierarchy = authorizeRoleHierarchy;
//# sourceMappingURL=authorizeRole.js.map