export declare class ApiResponse<T> {
    statusCode: number;
    message: string;
    data?: T | undefined;
    isSuccess: boolean;
    constructor(statusCode: number, message: string, data?: T | undefined, isSuccess?: boolean);
    static success<T>(data: T, message?: string, statusCode?: number): ApiResponse<T>;
    static error(message?: string, statusCode?: number): ApiResponse<null>;
}
//# sourceMappingURL=apiResponse.d.ts.map