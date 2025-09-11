import { create } from "zustand";

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, ""); // Remove trailing slash if any

export const useAuthStore = create((set) => ({
  user: null,
  isAuthReady: false,

  // Initialize auth state from localStorage
  init: () => {
    const user = JSON.parse(localStorage.getItem("user")) || null;
    set({ user, isAuthReady: true });
  },

  // Login
  login: async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Login failed:", errorData.message || res.statusText);
        return null;
      }

      const user = await res.json();
      set({ user });

      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");

      return user;
    } catch (err) {
      console.error("Login error:", err);
      return null;
    }
  },

  // Logout
  logout: () => {
    set({ user: null });
    localStorage.removeItem("user");
  },

  // Update profile locally
  updateProfile: (updatedFields) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedFields } : null,
    })),

  // Refresh user from backend
  refreshUser: async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) return;

    let endpoint = "";
    if (user.role === "student") endpoint = `${API_BASE}/students/${user.username}`;
    else if (user.role === "librarian") endpoint = `${API_BASE}/librarians/${user.username}`;
    else return;

    try {
      const res = await fetch(endpoint, { headers: { "Content-Type": "application/json" } });
      if (!res.ok) {
        console.error("Failed to refresh user data:", res.statusText);
        return;
      }

      const updatedUser = await res.json();
      const mergedUser = { ...user, ...updatedUser };
      set({ user: mergedUser });
      localStorage.setItem("user", JSON.stringify(mergedUser));
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  },
}));
