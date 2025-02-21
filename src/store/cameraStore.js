import create from 'zustand';

const useCameraStore = create((set, get) => ({
  remainingExposureTime: 0,
  progress: 0,
  imageData: null,
  loading: false,
  isExposure: false,
  isLoadingImage: false,
  isLooping: false,
  isAbort: false,
  showInfo: false,
  coolingTemp: -10,
  coolingTime: 10,
  warmingTime: 10,
  buttonCoolerOn: false,
  plateSolveError: false,
  plateSolveResult: '',
  exposureCountdown: 0,
  exposureProgress: 0,
  countdownRunning: false,
  binningMode: '1x1',
  readoutMode: 0,
  containerSize: 100,
  slewModal: false,

  wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  startExposureCountdown: (totalTime) => {
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(() => {
        const { isExposure, remainingExposureTime, progress } = get();
        if (!isExposure) {
          clearInterval(intervalId);
          reject(new Error('Exposure was aborted.'));
          return;
        }

        set((state) => ({
          remainingExposureTime: state.remainingExposureTime - 1,
          progress: ((totalTime - state.remainingExposureTime) / totalTime) * 100,
        }));

        if (remainingExposureTime <= 0) {
          clearInterval(intervalId);
          set({ progress: 100 });
          resolve();
        }
      }, 1000);
    });
  },

  capturePhoto: async (apiService, exposureTime, gain, solve = false) => {
    if (exposureTime <= 0) {
      exposureTime = 2;
      return;
    }

    set({
      loading: true,
      isExposure: true,
      isLoadingImage: false,
      isAbort: false,
      remainingExposureTime: exposureTime,
      progress: 0,
    });

    try {
      const capturePromise = apiService.startCapture(exposureTime, gain, solve);
      await get().startExposureCountdown(exposureTime);
      await capturePromise;

      set({ isExposure: false, isLoadingImage: true });

      let attempts = 0;
      const maxAttempts = 60;
      let image = null;

      while (!image && attempts < maxAttempts && !get().isAbort) {
        try {
          const result = await apiService.getCaptureResult(get().settingsStore.camera.imageQuality);
          image = result?.Response?.Image;
          if (image) {
            set({
              plateSolveResult: result?.Response?.PlateSolveResult,
              imageData: `data:image/jpeg;base64,${image}`,
            });
            break;
          }
        } catch (error) {
          console.error('Error fetching image:', error.message);
        }
        attempts++;
        await get().wait(1000);
      }

      if (!image && !get().isAbort) {
        alert('Image was not provided in time');
      }
    } catch (error) {
      console.error('Error during capture:', error.message);
    } finally {
      set({ loading: false, isLoadingImage: false });
      if (get().isLooping) {
        get().capturePhoto(apiService, exposureTime, gain);
      }
    }
  },

  abortExposure: async (apiService) => {
    try {
      console.log('Aborting exposure...');
      await apiService.cameraAction('abort-exposure');
      clearInterval(get().exposureCountdownTimer);

      set({
        isAbort: true,
        isExposure: false,
        isLoadingImage: false,
        isLooping: false,
        remainingExposureTime: 0,
        progress: 0,
      });

      console.log('Exposure successfully aborted.');
    } catch (error) {
      console.error('Error aborting exposure:', error);
    } finally {
      set({ loading: false });
    }
  },

  getCameraRotation: async (apiService, exposureTime = 2, gain) => {
    set({ loading: true, isLoadingImage: true, progress: 0, plateSolveError: false });

    try {
      let result;
      let plateSolveResult = null;
      let plateSolveStatusCode = 0;
      set({ isLoadingImage: true });
      result = await apiService.getPlatesovle(exposureTime, gain);
      console.log('result: ', result);

      plateSolveResult = result?.Response?.PlateSolveResult;
      plateSolveStatusCode = result?.StatusCode;
      if (plateSolveStatusCode != 200) {
        set({ plateSolveError: true });
        console.log('plateSolveError: ', plateSolveStatusCode, get().plateSolveError);
      }
      if (plateSolveResult) {
        get().framingStore.setState({ rotationAngle: plateSolveResult.PositionAngle });
        console.log('Camera position angle: ', get().framingStore.rotationAngle);
      }
    } catch (error) {
      console.error('Error during capture:', error.message);
    } finally {
      set({ loading: false, isLoadingImage: false });
    }
  },

  updateCountdown: async () => {
    const { cameraInfo } = get().store;
    const exposureEndTime = cameraInfo.ExposureEndTime;

    if (!exposureEndTime) {
      set({ exposureCountdown: 0, exposureProgress: 0 });
      return;
    }

    const endTime = new Date(exposureEndTime).getTime();
    if (isNaN(endTime)) {
      console.error('Invalid date format for ExposureEndTime.');
      set({ exposureCountdown: 0, exposureProgress: 0 });
      return;
    }

    const durationTime = Math.floor((endTime - Date.now()) / 1000);
    console.log('durationTime', durationTime);

    set({ countdownRunning: true });
    while (get().countdownRunning) {
      const now = Date.now();
      let remainingTime = Math.floor((endTime - now) / 1000);

      if (remainingTime <= 0 || !cameraInfo.IsExposing) {
        set({ exposureProgress: 100, exposureCountdown: 0 });
        await get().wait(1000);
        set({ exposureProgress: 0, countdownRunning: false });
        remainingTime = 0;
        break;
      }

      set({
        exposureCountdown: remainingTime,
        exposureProgress: Math.max(0, Math.min(100, (1 - remainingTime / durationTime) * 100)),
      });
      await get().wait(1000);
    }
  },
}));

export default useCameraStore;
