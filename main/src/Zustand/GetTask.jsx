import { create } from "zustand";

export const useTaskStore = create((set) => ({
    tasks: [],
    loading: false,
    error: null,

    fetchTasks: async () => {
        set({ loading: true, error: null });

        try {
            const authUser = localStorage.getItem("authUser");
            const parsedUser = authUser ? JSON.parse(authUser) : null;
            const userId = parsedUser?._id;
            const token = parsedUser?.token;
            

            if (!userId || !token) {
                throw new Error("User not authenticated");
            }


            const res = await fetch(
                `https://hrms-backend2.onrender.com/api/get-tasks`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!res.ok) throw new Error("Failed to fetch tasks");

            const data = await res.json();
            set({ tasks: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
}));
