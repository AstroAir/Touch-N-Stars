import create from 'zustand';
import apiService from '@/services/apiService';
import useApiStore from '@/store/store';

const useLogStore = create((set, get) => ({
  intervalId: null,
  LogsInfo: {
    logs: [],
  },
  canSetPos: true,
  foundPos: 0,
  foundPosTime: new Date(),
  focuserData: [],
  startAfTime: '',
  lastHfrLogTime: 0,

  fetchLogInfos: async () => {
    try {
      const store = useApiStore.getState();

      if (!store.isBackendReachable) {
        console.warn('Backend ist nicht erreichbar log');
        return;
      }

      const logs = await apiService.getLastLogs('100');
      set({ LogsInfo: { logs } });
    } catch (error) {
      console.error('Fehler beim Abrufen der Informationen:', error);
    }
  },

  startFetchingLog: () => {
    if (!get().intervalId) {
      const intervalId = setInterval(get().fetchLogInfos, 2000);
      set({ intervalId });
    }
  },

  stopFetchingLog: () => {
    if (get().intervalId) {
      clearInterval(get().intervalId);
      set({ intervalId: null });
    }
  },
}));

export default useLogStore;
