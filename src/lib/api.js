/**
 * Centralized API Client for Boat Warranty Hub
 * Handles HTTP requests, JWT authorization header injection, and standardized error parsing.
 */

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("boat_token") || "";
  }
  return "";
};

export async function apiFetch(endpoint, options = {}) {
  const token = getAuthToken();
  
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // If body is NOT FormData, set Content-Type to application/json
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(endpoint, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const apiGet = (endpoint) => apiFetch(endpoint, { method: "GET" });

export const apiPost = (endpoint, body) =>
  apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const apiPut = (endpoint, body) =>
  apiFetch(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const apiDelete = (endpoint) =>
  apiFetch(endpoint, {
    method: "DELETE",
  });

export const apiUpload = (endpoint, formData) =>
  apiFetch(endpoint, {
    method: "POST",
    body: formData,
    // Do NOT manually set Content-Type header so browser sets boundary correctly
  });
