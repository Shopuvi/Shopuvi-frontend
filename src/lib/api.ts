import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = Cookies.get("shopuvi_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle token expiry globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("shopuvi_token");
      Cookies.remove("shopuvi_user");
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authAPI = {
  register: async (data: {
    username: string;
    email: string;
    password: string;
    role: "VENDOR" | "CUSTOMER";
  }) => {
    const res = await api.post("/api/auth/register", data);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post("/api/auth/login", data);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get("/api/auth/me");
    return res.data;
  },
};

// ─── Business ─────────────────────────────────────────────────────────────────

export const businessAPI = {
  create: async (data: {
    business_name: string;
    description?: string;
    category?: string;
    location?: string;
    logo_url?: string;
    banner_url?: string;
    phone?: string;
  }) => {
    const res = await api.post("/api/business", data);
    return res.data;
  },

  getMyBusiness: async () => {
    const res = await api.get("/api/business/me");
    return res.data;
  },

  getByUsername: async (username: string) => {
    const res = await api.get(`/api/business/${username}`);
    return res.data;
  },

  update: async (data: {
    business_name?: string;
    description?: string;
    category?: string;
    location?: string;
    logo_url?: string;
    banner_url?: string;
    phone?: string;
  }) => {
    const res = await api.patch("/api/business/me", data);
    return res.data;
  },
};

// ─── Products ─────────────────────────────────────────────────────────────────

export const productAPI = {
  create: async (data: {
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    is_available?: boolean;
  }) => {
    const res = await api.post("/api/products", data);
    return res.data;
  },

  getByBusiness: async (businessId: string) => {
    const res = await api.get(`/api/products/business/${businessId}`);
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get(`/api/products/${id}`);
    return res.data;
  },

  update: async (
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      image_url?: string;
      is_available?: boolean;
    }
  ) => {
    const res = await api.patch(`/api/products/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/api/products/${id}`);
    return res.data;
  },
};

// ─── Feed ─────────────────────────────────────────────────────────────────────

export const feedAPI = {
  getFeed: async (page = 1, limit = 12) => {
    const res = await api.get(`/api/feed?page=${page}&limit=${limit}`);
    return res.data;
  },
};

// ─── Search ───────────────────────────────────────────────────────────────────

export const searchAPI = {
  search: async (query: string, page = 1, limit = 12) => {
    const res = await api.get(
      `/api/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    return res.data;
  },
};

// ─── Messages ─────────────────────────────────────────────────────────────────

export const messageAPI = {
  getInbox: async () => {
    const res = await api.get("/api/messages");
    return res.data;
  },

  startConversation: async (vendor_id: string) => {
    const res = await api.post("/api/messages/start", { vendor_id });
    return res.data;
  },

  getMessages: async (conversationId: string) => {
    const res = await api.get(`/api/messages/${conversationId}`);
    return res.data;
  },

  sendMessage: async (
    conversationId: string,
    data: { content?: string; image_url?: string; type?: "TEXT" | "IMAGE" }
  ) => {
    const res = await api.post(`/api/messages/${conversationId}`, data);
    return res.data;
  },
};

export default api;
