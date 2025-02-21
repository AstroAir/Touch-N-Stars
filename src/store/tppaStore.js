import create from 'zustand';

const useTppaStore = create((set) => ({
  lastMessage: null,
  status: 'nicht verbunden',
  isConnected: false,
  currentMessage: null,
  isRunning: false,
  initialized: false,

  setRunning: (isRunning) => {
    set({ isRunning });
    // Persist state to localStorage
    localStorage.setItem('tppaStore', JSON.stringify(get().$state));
  },

  initialize: () => {
    if (!get().initialized) {
      const savedState = localStorage.getItem('tppaStore');
      if (savedState) {
        set(JSON.parse(savedState));
      }
      set({ initialized: true });
    }
  },
}));

export default useTppaStore;
