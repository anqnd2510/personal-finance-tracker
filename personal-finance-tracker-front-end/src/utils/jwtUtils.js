/**
 * Decode JWT token without verification
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const decodeJWT = (token) => {
  try {
    if (!token) {
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Date.now() / 1000;
    const isExpired = decoded.exp < currentTime;
    return isExpired;
  } catch (error) {
    return true;
  }
};

/**
 * Get user role from JWT token
 * @param {string} token - JWT token
 * @returns {string|null} - User role or null
 */
export const getUserRoleFromToken = (token) => {
  const decoded = decodeJWT(token);
  const role = decoded?.role || null;
  return role;
};

/**
 * Get user info from JWT token
 * @param {string} token - JWT token
 * @returns {object|null} - User info or null
 */
export const getUserInfoFromToken = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) {
    return null;
  }

  const userInfo = {
    id: decoded.id || decoded.userId || decoded._id,
    email: decoded.email,
    role: decoded.role,
    firstName: decoded.firstName,
    lastName: decoded.lastName,
    exp: decoded.exp,
    iat: decoded.iat,
  };

  return userInfo;
};
