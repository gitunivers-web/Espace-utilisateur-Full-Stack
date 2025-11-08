import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BankStore {
  theme: 'light' | 'dark';
  language: 'fr' | 'en';
  toggleTheme: () => void;
  setLanguage: (lang: 'fr' | 'en') => void;
}

export const useBankStore = create<BankStore>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'fr',
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme: newTheme };
        }),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'altus-bank-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
