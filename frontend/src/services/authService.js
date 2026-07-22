/**
 * SQLi Lab - Phase 1 Simplified Auth Service
 * Exposes login and logout placeholder functions that communicate with the Flask backend.
 */

const API_BASE_URL = "http://localhost:5000/api";

/**
 * Handle user authentication
 * POST /api/auth/login
 */
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Login API Response:", data);
    return data;
  } catch (error) {
    console.error("Login API Error:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Handle user logout
 * POST /api/auth/logout
 */
export const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Logout API Response:", data);
    return data;
  } catch (error) {
    console.error("Logout API Error:", error);
    return { success: false, message: error.message };
  }
};
