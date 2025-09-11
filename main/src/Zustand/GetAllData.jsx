import { create } from "zustand";

export const useUserStore = create((set) => ({
  allData: { data: {} },
  loading: false,
  error: null,

  // Fetch All Users
  fetchAllData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("https://hrms-backend2.onrender.com/api/user");
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      set({ allData: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Delete a User
  deleteUser: async (userId) => {
    try {
      const res = await fetch(
        `https://hrms-backend2.onrender.com/api/user/${userId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete user");

      // Update Zustand store by filtering out deleted user
      set((state) => ({
        allData: {
          ...state.allData,
          data: Object.fromEntries(
            Object.entries(state.allData.data || {}).map(([role, users]) => [
              role,
              users.filter((u) => u._id !== userId),
            ])
          ),
        },
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },
}));
