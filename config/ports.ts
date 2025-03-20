// Port Configuration
const PORTS = {
  BACKEND: 3001,
  FRONTEND: 3000,
  ADMIN_DASHBOARD: 3003,
} as const;

// URL Configuration
const URLS = {
  BACKEND_URL: `http://localhost:${PORTS.BACKEND}`,
  BACKEND_API_URL: `http://localhost:${PORTS.BACKEND}/api`,
  FRONTEND_URL: `http://localhost:${PORTS.FRONTEND}`,
  ADMIN_DASHBOARD_URL: `http://localhost:${PORTS.ADMIN_DASHBOARD}`,
  GOOGLE_CALLBACK_URL: `http://localhost:${PORTS.BACKEND}/auth/google/callback`,
} as const;

export { PORTS, URLS };
export default { PORTS, URLS }; 