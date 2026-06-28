import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types";
import client from "../apis/client";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  fetchProfile: () => Promise<User | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (credentials) => {
        try {
          const response = await client.post("/auth/login/", credentials);
          const responseData = response.data.data || response.data;
          
          set({
            user: responseData.user,
            accessToken: responseData.access,
            refreshToken: responseData.refresh,
            isAuthenticated: true,
          });
          return responseData.user;
        } catch (error: any) {
          throw error.response?.data || error;
        }
      },

      logout: async () => {
        const refresh = get().refreshToken;
        if (refresh) {
          try {
            await client.post("/auth/logout/", { refresh });
          } catch (e) {
            console.error("Logout request error:", e);
          }
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updatedFields) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updatedFields } });
        }
      },

      fetchProfile: async () => {
        try {
          const response = await client.get("/users/profile/");
          const profile = response.data.data;
          set({ user: profile });
          return profile;
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          return null;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useAuthStore;
