import { create } from 'zustand';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  token: string | null; // Backward-compatible alias
  accessToken: string | null;
  refreshToken: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  accessToken: null,
  refreshToken: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,

  initAuth: () => {
    if (typeof window === 'undefined') return;
    try {
      const storedAccessToken =
        localStorage.getItem('dropoflife_access_token') ||
        localStorage.getItem('dropoflife_token');
      const storedRefreshToken = localStorage.getItem('dropoflife_refresh_token');
      const storedUser = localStorage.getItem('dropoflife_user');

      if (storedAccessToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const normalizedRole: UserRole =
          parsedUser.role === 'hospital' ? 'provider' : (parsedUser.role as UserRole);
        parsedUser.role = normalizedRole;
        set({
          token: storedAccessToken,
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken || null,
          user: parsedUser,
          role: normalizedRole,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    } catch (e) {
      console.warn('Failed to parse cached auth state:', e);
    }
    set({ isLoading: false });
  },

  setAuth: (user: User, accessToken: string, refreshToken?: string) => {
    const normalizedRole: UserRole =
      (user.role as string) === 'hospital' ? 'provider' : user.role;
    const normalizedUser = { ...user, role: normalizedRole };

    if (typeof window !== 'undefined') {
      localStorage.setItem('dropoflife_access_token', accessToken);
      localStorage.setItem('dropoflife_token', accessToken);
      localStorage.setItem('dropoflife_user', JSON.stringify(normalizedUser));

      if (refreshToken) {
        localStorage.setItem('dropoflife_refresh_token', refreshToken);
        document.cookie = `dropoflife_refresh_token=${refreshToken}; path=/; max-age=2592000; SameSite=Lax`;
      }

      // Set cookie for Next.js Edge Middleware
      document.cookie = `dropoflife_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `dropoflife_role=${normalizedRole}; path=/; max-age=86400; SameSite=Lax`;
    }
    set({
      user: normalizedUser,
      token: accessToken,
      accessToken,
      refreshToken: refreshToken || null,
      role: normalizedRole,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  updateUser: (updates: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem('dropoflife_user', JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dropoflife_access_token');
      localStorage.removeItem('dropoflife_token');
      localStorage.removeItem('dropoflife_refresh_token');
      localStorage.removeItem('dropoflife_user');
      localStorage.removeItem('dropoflife_role');
      sessionStorage.clear();

      // Clear all possible auth cookies on root path
      const expiredSuffix = '=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      document.cookie = `dropoflife_token${expiredSuffix}`;
      document.cookie = `dropoflife_refresh_token${expiredSuffix}`;
      document.cookie = `dropoflife_role${expiredSuffix}`;
      document.cookie = `accessToken${expiredSuffix}`;
      document.cookie = `token${expiredSuffix}`;
      document.cookie = `refreshToken${expiredSuffix}`;

      // Notify backend if available
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api/v1';
        fetch(`${apiUrl}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
      } catch (e) {}
    }
    set({
      user: null,
      token: null,
      accessToken: null,
      refreshToken: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
