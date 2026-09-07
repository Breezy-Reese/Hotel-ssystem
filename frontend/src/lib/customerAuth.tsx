import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import {
  customerApi,
  clearCustomerSession,
  getStoredCustomer,
  getCustomerToken,
  onCustomerUnauthorized,
  setCustomerSession,
} from "./customerApi";

export interface CustomerUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface CustomerAuthResponse {
  status: string;
  token: string;
  data: { guest: CustomerUser };
}

interface CustomerAuthContextValue {
  customer: CustomerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getCustomerToken();
    const stored = getStoredCustomer<CustomerUser>();
    if (token && stored) setCustomer(stored);
    setIsLoading(false);
  }, []);

  // Mirrors the staff AuthProvider's pattern: any 401 from a customer-scoped
  // request clears the stale session and updates this context so the app
  // actually reacts (see the note in lib/api.ts about why this matters).
  useEffect(() => onCustomerUnauthorized(() => setCustomer(null)), []);

  async function login(email: string, password: string) {
    const res = await customerApi.post<CustomerAuthResponse>("/customer-auth/login", { email, password });
    setCustomerSession(res.token, res.data.guest);
    setCustomer(res.data.guest);
  }

  async function register(name: string, email: string, password: string, phone?: string) {
    const res = await customerApi.post<CustomerAuthResponse>("/customer-auth/register", {
      name,
      email,
      password,
      phone,
    });
    setCustomerSession(res.token, res.data.guest);
    setCustomer(res.data.guest);
  }

  function logout() {
    clearCustomerSession();
    setCustomer(null);
  }

  return (
    <CustomerAuthContext.Provider
      value={{ customer, isAuthenticated: !!customer, isLoading, login, register, logout }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  return ctx;
}