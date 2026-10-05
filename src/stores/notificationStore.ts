import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'pledge' | 'cancel' | 'info' | 'success' | 'critical';
  requestId?: string;
  timestamp: number;
  read: boolean;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  activeToast: AppNotification | null;
  isPanelOpen: boolean;
  directRequests: any[];
  addNotification: (
    n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>
  ) => void;
  dismissToast: () => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
  setPanelOpen: (open: boolean) => void;
  togglePanel: () => void;
  setDirectRequests: (reqs: any[]) => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'init-1',
    title: '🩸 ড্রপ অফ লাইফ পরিবারে স্বাগতম',
    body: 'জরুরি রক্তদান ও হাসপাতাল সমন্বয় নেটওয়ার্কে আপনাকে স্বাগতম। আপনার এক ফোঁটা রক্ত বাঁচাতে পারে একটি জীবন।',
    type: 'success',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
    read: false,
  },
  {
    id: 'init-2',
    title: '🚨 জরুরি রক্তের অ্যালার্ট • ঢাকা',
    body: 'ঢাকা মেডিকেল কলেজ হাসপাতালে জরুরি ভিত্তিতে ২ ইউনিট O+ রক্তের প্রয়োজন।',
    type: 'pledge',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    read: true,
  },
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: INITIAL_NOTIFICATIONS,
      unreadCount: 1,
      activeToast: null,
      isPanelOpen: false,
      directRequests: [],

      setPanelOpen: (open: boolean) => set({ isPanelOpen: open }),
      togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
      setDirectRequests: (directRequests: any[]) => set({ directRequests }),

      addNotification: (n) => {
        const newNotif: AppNotification = {
          ...n,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: Date.now(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications].slice(0, 50),
          unreadCount: state.unreadCount + 1,
          activeToast: newNotif,
        }));
      },

      dismissToast: () => {
        set({ activeToast: null });
      },

      markRead: (id) => {
        set((state) => {
          const target = state.notifications.find((n) => n.id === id);
          if (target && !target.read) {
            return {
              notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
              ),
              unreadCount: Math.max(0, state.unreadCount - 1),
            };
          }
          return state;
        });
      },

      markAllRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            read: true,
          })),
          unreadCount: 0,
        }));
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0, activeToast: null });
      },
    }),
    {
      name: 'dropoflife_notifications',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
