const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getToken = () => localStorage.getItem("token");

export const setAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * Decode JWT payload without any library.
 * Returns null if token is missing or malformed.
 */
export const decodeToken = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    const json = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

/**
 * Returns true if the stored JWT is present AND not expired.
 */
export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return false;
  // exp is in seconds, Date.now() is ms
  return payload.exp * 1000 > Date.now();
};

// Callback that Dashboard/App can set so apiFetch can trigger auto-logout
let _onTokenExpired = null;
export const setTokenExpiredHandler = (handler) => {
  _onTokenExpired = handler;
};

/**
 * Sleep helper for retry delays.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Core fetch with automatic retry on cold-start failures (network errors).
 * - Retries up to `maxRetries` times on TypeError (fetch/network failure)
 * - Uses exponential backoff: 1s, 2s, 4s...
 * - Does NOT retry on HTTP errors (4xx/5xx) — those are real errors.
 */
const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      return response; // success — return immediately
    } catch (err) {
      lastError = err;

      // Only retry on network errors (cold start, connection refused, etc.)
      // TypeError = "Failed to fetch" / network issue
      if (!(err instanceof TypeError)) {
        throw err; // some other error — don't retry
      }

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.warn(
          `[API] Request failed (attempt ${attempt + 1}/${maxRetries + 1}). Cold start? Retrying in ${delay / 1000}s...`
        );
        await sleep(delay);
      }
    }
  }

  throw lastError; // all retries exhausted
};

export const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetchWithRetry(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  // 401 = token expired or invalid — trigger auto-logout
  if (response.status === 401) {
    clearAuth();
    if (_onTokenExpired) {
      _onTokenExpired();
    } else {
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

/**
 * Ping the backend to wake it up from Vercel cold start.
 * Call this on app load so the server is warm before the user submits a form.
 */
export const warmUpServer = () => {
  fetch(`${API_BASE}/`).catch(() => {
    // Silently ignore — this is just a warm-up ping
  });
};

export const signupUser = (payload) =>
  apiFetch("/api/users/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const loginUser = (payload) =>
  apiFetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getDashboard = () => apiFetch("/api/dashboard");

export const updateProfile = (payload) =>
  apiFetch("/api/dashboard/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const changePassword = (payload) =>
  apiFetch("/api/dashboard/password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const logoutUser = () => apiFetch("/api/dashboard/logout", { method: "POST" });

export const deleteUserAccount = () => apiFetch("/api/dashboard/account", { method: "DELETE" });
