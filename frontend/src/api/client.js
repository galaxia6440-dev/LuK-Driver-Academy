import { API_BASE } from "./config.js";

const BASE = API_BASE;

function authHeaders() {
  const token = window.localStorage.getItem("luk_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res) {
  if (!res.ok) {
    let msg = "Erreur";
    try {
      const data = await res.json();
      msg = data.error || msg;
    } catch (e) {
      // ignore
    }
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  get: (path) => fetch(`${BASE}${path}`, { headers: { ...authHeaders() } }).then(handle),
  post: (path, body) =>
    fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    }).then(handle),
  put: (path, body) =>
    fetch(`${BASE}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    }).then(handle),
  del: (path) => fetch(`${BASE}${path}`, { method: "DELETE", headers: { ...authHeaders() } }).then(handle),
  postForm: (path, formData) =>
    fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { ...authHeaders() },
      body: formData,
    }).then(handle),
};
