const isProduction = import.meta.env.MODE === "production";
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || (isProduction ? "" : "http://localhost:5000");
