import { create } from 'zustand';

export const useColorStore = create((set) => {
  const savedHeader = localStorage.getItem('headerColor');
  const savedFooter = localStorage.getItem('footerColor');

  return {
    headerColor: savedHeader || '',
    footerColor: savedFooter || '',

    setHeaderColor: (color) => {
      localStorage.setItem('headerColor', color);
      set({ headerColor: color });
    },

    setFooterColor: (color) => {
      localStorage.setItem('footerColor', color);
      set({ footerColor: color });
    },
  };
});