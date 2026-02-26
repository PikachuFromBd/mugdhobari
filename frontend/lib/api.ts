// Centralized API URL — used by every component.
// In production / Cloudflare tunnel: uses Next.js rewrite proxy (relative path).
// In local dev: falls back to env variable or relative path.
//
// The Next.js rewrite in next.config.js proxies  /api/*  →  http://localhost:5000/api/*
// so the browser never needs to know the backend address.

export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
