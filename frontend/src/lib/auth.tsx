import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { api, clearSession, getStoredUser, getToken, setSession } from "./api";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  branch?: string;
  status: string;
}

interface LoginResponse {
  status: string;
  token: string;
  data: { user: AuthUser };
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser<AuthUser>();
    if (token && storedUser) setUser(storedUser);
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post<LoginResponse>("/auth/login", { email, password });
    setSession(res.token, res.data.user);
    setUser(res.data.user);
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
