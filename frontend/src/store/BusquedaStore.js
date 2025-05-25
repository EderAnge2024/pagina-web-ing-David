// store/BusquedaStore.js
import { create } from 'zustand';

const useBusquedaStore = create((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

export default useBusquedaStore;