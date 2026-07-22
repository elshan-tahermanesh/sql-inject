/**
 * SQLi Lab - Phase 1 API Service
 * Exposes placeholder functions to communicate with the Flask backend.
 */

const API_BASE_URL = "http://localhost:5000/api";

/**
 * Check backend service health status
 * GET /api/health
 */
export async function healthCheck() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Health check request failed:", error);
    return { status: "error", message: error.message };
  }
}

/**
 * Handle user authentication
 * POST /api/vulnerable/login or POST /api/secure/login
 */
export async function login(username, password, isVulnerable = true) {
  try {
    const endpoint = isVulnerable ? "vulnerable/login" : "secure/login";
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Login request failed:", error);
    return { status: "error", message: error.message };
  }
}

/**
 * Execute search query simulation
 * POST /api/vulnerable/search or POST /api/secure/search
 */
export async function search(query, isVulnerable = true) {
  try {
    const endpoint = isVulnerable ? "vulnerable/search" : "secure/search";
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Search request failed:", error);
    return { status: "error", message: error.message };
  }
}

/**
 * Provision new user record
 * POST /api/vulnerable/create-user or POST /api/secure/create-user
 */
export async function createUser(userData, isVulnerable = true) {
  try {
    const endpoint = isVulnerable ? "vulnerable/create-user" : "secure/create-user";
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Create user request failed:", error);
    return { status: "error", message: error.message };
  }
}

/**
 * Execute SQL injection attack simulation on the backend
 * POST /api/attacks/:type
 */
export async function executeAttack(type, targetUrl, payload, extraData = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/attacks/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target_url: targetUrl,
        payload: payload,
        ...extraData
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Attack execution for ${type} failed:`, error);
    return { success: false, error: error.message };
  }
}
