import { create } from "zustand";

export const useUserStore = create((set, get) => ({
  // 🔹 State
  allData: [],
  loading: false,
  error: null,

  // 🔹 Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setAllData: (data) => set({ allData: data }),

  // 🔹 Reset store
  resetStore: () => set({ allData: [], loading: false, error: null }),

  // 🔹 Fetch all data from API
  fetchAllData: async () => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://hrms-backend2.onrender.com/api/user"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const data = await response.json();
      set({ allData: data, loading: false, error: null });
    } catch (error) {
      set({
        error: error.message || "Something went wrong",
        loading: false,
      });
    }
  },
}));
