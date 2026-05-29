import { useState, useEffect, createContext, useContext } from "react";

export const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function useAuthState() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always clear session on app start so login page shows first
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    setUser(null);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    await new Promise((res) => setTimeout(res, 800));
    // Clear any previously stored session first
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    setUser(null);
    const users = JSON.parse(localStorage.getItem("registered_users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid email or password.");
    const userData = { id: found.id, name: found.name, email: found.email };
    localStorage.setItem("auth_user", JSON.stringify(userData));
    localStorage.setItem("auth_token", `mock-token-${found.id}`);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    await new Promise((res) => setTimeout(res, 800));
    const users = JSON.parse(localStorage.getItem("registered_users") || "[]");
    if (users.find((u) => u.email === email)) {
      throw new Error("An account with this email already exists.");
    }
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem("registered_users", JSON.stringify(users));
    const userData = { id: newUser.id, name, email };
    localStorage.setItem("auth_user", JSON.stringify(userData));
    localStorage.setItem("auth_token", `mock-token-${newUser.id}`);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  const getToken = () => localStorage.getItem("auth_token");

  return { user, loading, login, register, logout, getToken };
}