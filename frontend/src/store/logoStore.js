import { create } from 'zustand';
import axios from 'axios';

const useLogoStore = create((set) => ({
    logos: [],
    
    addLogo: async (logo) => {
        try {
            const response = await axios.post('http://localhost:3001/logo', logo);
            set((state) => ({ logos: [...state.logos, response.data] }));
        } catch (error) {
            console.log("Error adding logo:", error.message);
        }
    },

    fetchLogos: async () => {
        try {
            const response = await axios.get('http://localhost:3001/logo');
            set({ logos: response.data });
        } catch (error) {
            console.log("Error fetching logos:", error.message);
        }
    },

    deleteLogo: async (ID_Logo) => {
        try {
            const response = await axios.delete(`http://localhost:3001/logo/${ID_Logo}`);
            console.log("Logo deleted:", response.data);
            set((state) => ({ logos: state.logos.filter(logo => logo.ID_Logo !== ID_Logo) }));
        } catch (error) {
            console.log("Error deleting logo:", error.message);
        }
    },

    updateLogo: async (ID_Logo, updatedData) => {
        try {
            const response = await axios.put(`http://localhost:3001/logo/${ID_Logo}`, updatedData);
            console.log("Logo updated:", response.data);
            set((state) => ({
                logos: state.logos.map((logo) =>
                    logo.ID_Logo === ID_Logo ? { ...logo, ...response.data } : logo
                )
            }));
        } catch (error) {
            console.log("Error updating logo:", error.message);
        }
    }
}));

export default useLogoStore;
