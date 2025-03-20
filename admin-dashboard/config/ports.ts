// Port Configuration
const PORTS = {
  BACKEND: 3003,
  FRONTEND: 3002,
} as const;

// URL Configuration
const URLS = {
  BACKEND_URL: `http://localhost:${PORTS.BACKEND}`,
  BACKEND_API_URL: `http://localhost:${PORTS.BACKEND}/api`,
  FRONTEND_URL: `http://localhost:${PORTS.FRONTEND}`,
} as const;

export { PORTS, URLS };
export default { PORTS, URLS }; 