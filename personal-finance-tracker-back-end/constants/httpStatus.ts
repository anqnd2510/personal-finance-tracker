export const HTTP_STATUS = {
  OK: 200, // Request succeeded
  CREATED: 201, // Resource created
  ACCEPTED: 202, // Request accepted but not completed
  NO_CONTENT: 204, // No content to return
  BAD_REQUEST: 400, // Invalid request syntax
  UNAUTHORIZED: 401, // Not authenticated
  PAYMENT_REQUIRED: 402, // Payment required (rarely used)
  FORBIDDEN: 403, // Authenticated but not authorized
  NOT_FOUND: 404, // Resource not found
  METHOD_NOT_ALLOWED: 405, // Method not allowed
  CONFLICT: 409, // Resource conflict
  UNPROCESSABLE_ENTITY: 422, // Semantic errors in request

  INTERNAL_SERVER_ERROR: 500, // Server error
  NOT_IMPLEMENTED: 501, // Not implemented
  BAD_GATEWAY: 502, // Invalid response from upstream
  SERVICE_UNAVAILABLE: 503, // Server temporarily unavailable
  GATEWAY_TIMEOUT: 504, // Upstream server timeout
} as const;
