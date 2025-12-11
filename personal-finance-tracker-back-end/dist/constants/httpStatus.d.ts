export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly ACCEPTED: 202;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly PAYMENT_REQUIRED: 402;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly METHOD_NOT_ALLOWED: 405;
    readonly NOT_ACCEPTABLE: 406;
    readonly CONFLICT: 409;
    readonly GONE: 410;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly REQUEST_TIMEOUT: 408;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly NOT_IMPLEMENTED: 501;
    readonly BAD_GATEWAY: 502;
    readonly SERVICE_UNAVAILABLE: 503;
    readonly GATEWAY_TIMEOUT: 504;
    readonly HTTP_VERSION_NOT_SUPPORTED: 505;
};
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
//# sourceMappingURL=httpStatus.d.ts.map