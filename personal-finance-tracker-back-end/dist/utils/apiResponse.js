"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(statusCode, message, data, isSuccess = true) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.isSuccess = isSuccess;
    }
    static success(data, message = "Success", statusCode = 200) {
        return new ApiResponse(statusCode, message, data, true);
    }
    static error(message = "Error", statusCode = 500) {
        return new ApiResponse(statusCode, message, null, false);
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=apiResponse.js.map