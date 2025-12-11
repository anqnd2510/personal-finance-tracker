"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleHierarchy = exports.Role = void 0;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return client_1.Role; } });
exports.RoleHierarchy = {
    [client_1.Role.USER]: 1,
    [client_1.Role.MANAGER]: 2,
    [client_1.Role.ADMIN]: 3,
};
//# sourceMappingURL=role.js.map