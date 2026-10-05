import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';

interface PledgeState {
  pledgedRequestIds: string[];
  addPledge: (requestId: string) => void;
  removePledge: (requestId: string) => void;
  isPledged: (
    requestId: string,
    user?: User | null,
    assignedDonors?: string[]
  ) => boolean;
}

export const usePledgeStore = create<PledgeState>()(
  persist(
    (set, get) => ({
      pledgedRequestIds: [],

      addPledge: (requestId: string) => {
        set((state) => {
          if (state.pledgedRequestIds.includes(requestId)) return state;
          return {
            pledgedRequestIds: [...state.pledgedRequestIds, requestId],
          };
        });
      },

      removePledge: (requestId: string) => {
        set((state) => ({
          pledgedRequestIds: state.pledgedRequestIds.filter(
            (id) => id !== requestId
          ),
        }));
      },

      isPledged: (
        requestId: string,
        user?: User | null,
        assignedDonors?: string[]
      ) => {
        const { pledgedRequestIds } = get();
        if (pledgedRequestIds.includes(requestId)) return true;
        if (user && assignedDonors && Array.isArray(assignedDonors)) {
          return assignedDonors.some(
            (d) =>
              d === user.name ||
              d === user.email ||
              d === user.id ||
              (user.name && d.toLowerCase() === user.name.toLowerCase())
          );
        }
        return false;
      },
    }),
    {
      name: 'dropoflife_pledges',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
