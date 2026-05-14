import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    clearTokens: () => void;

    setAccessToken: (accessToken: string) => void;
    setRefreshToken: (refreshToken: string) => void;

    isHydrated: boolean;}


export const useAuthStore = create<AuthState>()(
    persist((set) => 
        ({
            accessToken: null,
            refreshToken: null,
            setAccessToken: (accessToken: string) => set({ accessToken }),
            setRefreshToken: (refreshToken: string) => set({ refreshToken }),

            clearTokens: () => set({ accessToken: null, refreshToken: null }),
            isHydrated: false,
            isLoggedIn: false,
        }), 
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isHydrated = true;                }
            },
            partialize(state) {
                return {
                    refreshToken: state.refreshToken,
                }
            },
        }
    )
);
