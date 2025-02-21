import create from 'zustand';

const useFlatStore = create((set) => ({
  brightness: 100,

  setBrightness: (newBrightness) => set({ brightness: newBrightness }),
}));

export default useFlatStore;
