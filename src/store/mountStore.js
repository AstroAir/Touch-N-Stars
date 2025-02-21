import create from 'zustand';

const useMountStore = create((set) => ({
  lastDirection: '',
  rate: 1,

  setLastDirection: (direction) => set({ lastDirection: direction }),
  setRate: (newRate) => set({ rate: newRate }),
}));

export default useMountStore;
