"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { authAPI } from "@/lib/api";

interface User {
  id: string;
  username: string;
  email: string;
  role: "VENDOR" | "CUSTOMER";
  created_at: string;
  business?: {
    id: string;
    business_name: string;
    category: string;
    location: string;
    logo_url: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = Cookies.get("shopuvi_token");
    const savedUser = Cookies.get("shopuvi_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        Cookies.remove("shopuvi_token");
        Cookies.remove("shopuvi_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    Cookies.set("shopuvi_token", newToken, { expires: 7, sameSite: "strict" });
    Cookies.set("shopuvi_user", JSON.stringify(newUser), { expires: 7, sameSite: "strict" });
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    Cookies.remove("shopuvi_token");
    Cookies.remove("shopuvi_user");
    window.location.href = "/";
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data);
    } catch {
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
