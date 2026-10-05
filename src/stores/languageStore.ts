import { create } from 'zustand';

export type Language = 'bn' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'bn', // Default to Bengali as requested for primary audience, easily togglable to English
  setLanguage: (lang: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dropoflife_lang', lang);
    }
    set({ language: lang });
  },
  toggleLanguage: () => {
    set((state) => {
      const next: Language = state.language === 'bn' ? 'en' : 'bn';
      if (typeof window !== 'undefined') {
        localStorage.setItem('dropoflife_lang', next);
      }
      return { language: next };
    });
  },
}));

// Client-side initialization helper
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('dropoflife_lang') as Language;
    if (saved === 'bn' || saved === 'en') {
      useLanguageStore.setState({ language: saved });
    }
  } catch (e) {
    // Ignore in SSR
  }
}
