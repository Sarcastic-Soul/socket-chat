import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
    persist(
        (set) => ({
            primaryColor: 'teal', // Default primary color
            setPrimaryColor: (color) => set({ primaryColor: color }),
        }),
        {
            name: 'theme-storage', // name of the item in the storage (must be unique)
        }
    )
);

export default useThemeStore;
