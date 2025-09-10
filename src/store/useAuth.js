import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthReady: false,
  init: () => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    set({ user, isAuthReady: true });
  },
  login: async (username, password) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      // Handle HTTP errors, e.g., 401 Unauthorized
      const errorData = await res.json();
      console.error('Login failed:', errorData.message);
      return null;
    }
    const user = await res.json();
    set({ user: user || null });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    return user;
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem('user');
  },
  updateProfile: (updatedFields) => set((state) => ({
    user: state.user ? { ...state.user, ...updatedFields } : null,
  })),
  refreshUser: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'student' && user.username) {
      try {
        const res = await fetch(`/api/students/${user.username}`);
        if (res.ok) {
          const updatedStudent = await res.json();
          set({ user: { ...user, ...updatedStudent } }); // Merge with existing user data
          localStorage.setItem('user', JSON.stringify({ ...user, ...updatedStudent }));
        } else {
          console.error('Failed to refresh student data:', res.statusText);
        }
      } catch (error) {
        console.error('Error refreshing student data:', error);
      }
    }
    // Add logic for librarian or other roles if needed
  },
}));
