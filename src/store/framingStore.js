import create from 'zustand';
import apiService from '@/services/apiService';

const useFramingStore = create((set) => ({
  framingInfo: [],
  searchQuery: '',
  targetSearchResult: [],
  selectedItem: null,
  RAangle: 0,
  DECangle: 90,
  RAangleString: '',
  DECangleString: '',
  useNinaCache: true,
  fov: 5,
  camWidth: 100,
  camHeight: 100,
  containerSize: 500,
  rotationAngle: 0,
  showFramingModal: false,
  isSlewing: false,
  isSlewingAndCentering: false,
  isRotating: false,

  slew: async (RAangle, DECangle) => {
    console.log('SlewAndCenter', RAangle, DECangle);
    set({ isSlewing: true });
    try {
      await apiService.slewAndCenter(RAangle, DECangle, false);
    } catch (error) {
      console.error('SlewAndCenter Error', error);
    } finally {
      set({ isSlewing: false });
    }
  },

  slewAndCenter: async (RAangle, DECangle) => {
    console.log('SlewAndCenter', RAangle, DECangle);
    set({ isSlewingAndCentering: true });
    try {
      await apiService.slewAndCenter(RAangle, DECangle, true);
    } catch (error) {
      console.error('SlewAndCenter Error', error);
    } finally {
      set({ isSlewingAndCentering: false });
    }
  },

  cameraRotate: async () => {
    console.log('cameraRotate', get().rotationAngle);
    set({ isRotating: true });
    try {
      await apiService.framingRotate(get().rotationAngle);
    } catch (error) {
      console.error('cameraRotate Error', error);
    } finally {
      set({ isRotating: false });
    }
  },
}));

export default useFramingStore;
