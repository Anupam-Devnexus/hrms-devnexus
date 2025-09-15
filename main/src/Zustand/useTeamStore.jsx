import { create } from "zustand";

export const useTeamStore = create((set, get) => ({
  selectedTeam: [],
  teamName: "",
  teamDescription: "",
  showMyTeam: false,

  // toggle employee selection
  toggleMember: (id) => {
    const { selectedTeam } = get();
    set({
      selectedTeam: selectedTeam.includes(id)
        ? selectedTeam.filter((empId) => empId !== id)
        : [...selectedTeam, id],
    });
  },

  isMember: (id) => get().selectedTeam.includes(id),

  removeMember: (id) =>
    set((state) => ({
      selectedTeam: state.selectedTeam.filter((empId) => empId !== id),
    })),

  resetTeam: () => set({ selectedTeam: [], teamName: "", teamDescription: "" }),

  toggleShowMyTeam: () =>
    set((state) => ({ showMyTeam: !state.showMyTeam })),

  setTeamName: (name) => set({ teamName: name }),
  setTeamDescription: (desc) => set({ teamDescription: desc }),

  saveTeam: async () => {
    const { selectedTeam, teamName, teamDescription } = get();
    if (!teamName.trim()) {
      alert("⚠️ Please enter a team name.");
      return;
    }

    try {
      const response = await fetch("https://your-backend.com/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName,
          description: teamDescription,
          members: selectedTeam,
        }),
      });

      if (!response.ok) throw new Error("Failed to save team");

      const data = await response.json();
      console.log("✅ Team saved:", data);
      alert(`✅ Team "${teamName}" created with ${selectedTeam.length} members`);
      set({ selectedTeam: [], teamName: "", teamDescription: "" });
    } catch (error) {
      console.error("Save team error:", error);
      alert("❌ Failed to save team. Try again.");
    }
  },
}));
