// En développement (rien de défini), on utilise des chemins relatifs :
// Vite proxy /api et /uploads vers http://localhost:4000 (voir vite.config.js).
//
// En production, le frontend et le backend sont sur des domaines différents :
// VITE_API_URL doit pointer vers l'URL complète du backend déployé, par ex.
// https://luk-driver-academy-api.onrender.com
// (à définir dans les variables d'environnement de l'hébergeur du frontend).
const RAW_API_URL = import.meta.env.VITE_API_URL || "";

// Origine du backend sans suffixe (ex: https://luk-driver-academy-api.onrender.com),
// utilisée pour préfixer les photos servies par /uploads.
export const API_ORIGIN = RAW_API_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");

// Base des appels API : chemin relatif en dev, URL complète en prod.
export const API_BASE = RAW_API_URL ? `${API_ORIGIN}/api` : "/api";

/**
 * Résout une URL de média renvoyée par l'API (ex: "/uploads/cars/xyz/1.png")
 * vers une URL absolue pointant sur le backend en production.
 * En dev, retourne le chemin tel quel (le proxy Vite s'en charge).
 * Si l'URL est déjà absolue (http/https), elle est retournée telle quelle.
 */
export function mediaUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  if (!API_ORIGIN) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}
