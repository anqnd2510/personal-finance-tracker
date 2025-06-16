/**
 * Decode JWT token without verification
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const decodeJWT = (token) => {
  try {
    if (!token) {
      console.log("jwtUtils - No token provided");
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      console.log("jwtUtils - Invalid token format");
      return null;
    }

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));

    console.log("jwtUtils - Decoded JWT payload:", decoded);
    return decoded;
  } catch (error) {
    console.error("jwtUtils - Error decoding JWT:", error);
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
      console.log("jwtUtils - No expiration in token");
      return true;
    }

    const currentTime = Date.now() / 1000;
    const isExpired = decoded.exp < currentTime;
    console.log(
      "jwtUtils - Token expired:",
      isExpired,
      "exp:",
      decoded.exp,
      "current:",
      currentTime
    );
    return isExpired;
  } catch (error) {
    console.log("jwtUtils - Error checking expiration:", error);
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
  console.log("jwtUtils - Extracted role:", role);
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
    console.log("jwtUtils - No decoded data");
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

  console.log("jwtUtils - Extracted user info:", userInfo);
  return userInfo;
};
