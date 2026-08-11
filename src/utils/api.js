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
 * - Each attempt has a 30-second timeout via AbortController
 * - Retries up to `maxRetries` times on TypeError (fetch/network failure)
 * - Uses shorter backoff: 500ms, 1s, 2s, 3s — to recover faster from cold starts
 * - Does NOT retry on HTTP errors (4xx/5xx) — those are real errors.
 */
const fetchWithRetry = async (url, options = {}, maxRetries = 4) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // Create a per-attempt 30-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return response; // success — return immediately
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;

      // AbortError = our own 30s timeout fired
      const isTimeout = err.name === "AbortError";
      // TypeError = "Failed to fetch" / network issue (cold start, CORS preflight, etc.)
      const isNetworkError = err instanceof TypeError;

      if (!isTimeout && !isNetworkError) {
        throw err; // some other error — don't retry
      }

      if (attempt < maxRetries) {
        // Shorter backoff so we recover faster: 500ms, 1s, 2s, 3s
        const delay = Math.min((attempt + 1) * 500, 3000);
        console.warn(
          `[API] Request failed (attempt ${attempt + 1}/${maxRetries + 1}).${
            isTimeout ? " Timeout." : " Cold start?"
          } Retrying in ${delay / 1000}s...`
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
 * Retries a few times so the server is fully warm before the user submits a form.
 * Call this on app load (e.g. in App.jsx useEffect).
 */
export const warmUpServer = async () => {
  const maxPings = 4;
  for (let i = 0; i < maxPings; i++) {
    try {
      const res = await fetch(`${API_BASE}/`, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        console.log("[API] Server is warm and ready.");
        return;
      }
    } catch {
      // Server not ready yet — wait and retry
    }
    if (i < maxPings - 1) await sleep(2000);
  }
  console.warn("[API] Server may still be cold — user requests will retry automatically.");
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
