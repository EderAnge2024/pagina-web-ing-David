import { create } from 'zustand';

export const useColorStore = create((set) => {
  const savedHeader = localStorage.getItem('headerColor');
  const savedFooter = localStorage.getItem('footerColor');
  const savedButton = localStorage.getItem('buttonColor');

  return {
    headerColor: savedHeader || '',
    footerColor: savedFooter || '#292f36',
    buttonColor: savedButton || '#007BFF', // Color por defecto para los botones especiales

    setHeaderColor: (color) => {
      localStorage.setItem('headerColor', color);
      set({ headerColor: color });
    },
    setFooterColor: (color) => {
      localStorage.setItem('footerColor', color);
      set({ footerColor: color });
    },
    setButtonColor: (color) => {
      localStorage.setItem('buttonColor', color);
      set({ buttonColor: color });
    },
  };
});
