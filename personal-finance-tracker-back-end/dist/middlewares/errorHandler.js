"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const errorHandler = (err, req, res, next) => {
    if (err instanceof apiResponse_1.ApiResponse) {
        res.status(err.statusCode).json(err);
    }
    else {
        console.error(err);
        res.status(500).json(apiResponse_1.ApiResponse.error("Internal Server Error"));
    }
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map