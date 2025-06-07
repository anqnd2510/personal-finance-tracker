export const HTTP_STATUS = {
  // Success responses
  OK: 200, // Request succeeded
  CREATED: 201, // Resource created successfully
  ACCEPTED: 202, // Request accepted but not completed
  NO_CONTENT: 204, // No content to return

  // Client error responses
  BAD_REQUEST: 400, // Invalid request syntax
  UNAUTHORIZED: 401, // Not authenticated
  PAYMENT_REQUIRED: 402, // Payment required (rarely used)
  FORBIDDEN: 403, // Authenticated but not authorized
  NOT_FOUND: 404, // Resource not found
  METHOD_NOT_ALLOWED: 405, // Method not allowed for resource
  NOT_ACCEPTABLE: 406, // Content not acceptable
  CONFLICT: 409, // Resource conflict
  GONE: 410, // Resource no longer available
  UNPROCESSABLE_ENTITY: 422, // Semantic errors in request
  TOO_MANY_REQUESTS: 429, // Rate limit exceeded

  // Server error responses
  INTERNAL_SERVER_ERROR: 500, // Generic server error
  NOT_IMPLEMENTED: 501, // Server doesn't support functionality
  BAD_GATEWAY: 502, // Invalid response from upstream server
  SERVICE_UNAVAILABLE: 503, // Server temporarily unavailable
  GATEWAY_TIMEOUT: 504, // Upstream server timeout
  HTTP_VERSION_NOT_SUPPORTED: 505, // HTTP version not supported
} as const;

// Type for HTTP status codes
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
