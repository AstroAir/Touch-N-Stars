import create from 'zustand';
import apiService from '@/services/apiService';
import { useCameraStore } from '@/store/cameraStore';
import { useSettingsStore } from '@/store/settingsStore';

const useApiStore = create((set, get) => ({
  intervalId: null,
  intervalIdGraph: null,
  profileInfo: [],
  sequenceInfo: [],
  collapsedStates: {},
  cameraInfo: { IsExposing: false },
  mountInfo: [],
  filterInfo: [],
  focuserInfo: [],
  rotatorInfo: [],
  focuserAfInfo: [],
  guiderInfo: [],
  guiderChartInfo: [],
  flatdeviceInfo: [],
  domeInfo: [],
  safetyInfo: {
    Connected: false,
    IsSafe: false,
  },
  switchInfo: [],
  weatherInfo: [],
  RADistanceRaw: [],
  DECDistanceRaw: [],
  isBackendReachable: false,
  filterName: 'unbekannt',
  filterNr: null,
  showAfGraph: true,
  imageData: null,
  isLoadingImage: false,
  captureRunning: false,
  rotatorMechanicalPosition: 0,
  sequenceIsLoaded: false,
  sequenceRunning: false,
  existingEquipmentList: [],
  coordinates: null,
  currentLanguage: 'en',
  showSettings: false,
  minimumApiVersion: '2.1.7.0',
  currentApiVersion: null,
  isVersionNewerOrEqual: false,

  setSequenceRunning: (isRunning) => {
    set({ sequenceRunning: isRunning });
  },

  toggleCollapsedState: (containerName) => {
    set((state) => ({
      collapsedStates: {
        ...state.collapsedStates,
        [containerName]: !state.collapsedStates[containerName],
      },
    }));
  },

  isCollapsed: (containerName) => {
    return !!get().collapsedStates[containerName];
  },

  getGuiderInfo: async () => {
    try {
      const response = await apiService.guiderAction('info');
      if (response.Success) {
        set({ guiderInfo: response.Response });
      }
    } catch (error) {
      console.error('Error fetching guider info:', error);
    }
  },

  getGuiderChartInfo: async () => {
    try {
      const response = await apiService.guiderAction('graph');
      if (response.Success) {
        set({ guiderChartInfo: response.Response });
      }
    } catch (error) {
      console.error('Error fetching guider chart info:', error);
    }
  },

  fetchAllInfos: async () => {
    try {
      const versionResponse = await apiService.isBackendReachable();
      set({ isBackendReachable: !!versionResponse });

      if (get().isBackendReachable) {
        set({ currentApiVersion: versionResponse.Response });
        set({
          isVersionNewerOrEqual: get().checkVersionNewerOrEqual(
            get().currentApiVersion,
            get().minimumApiVersion
          ),
        });

        if (!get().isVersionNewerOrEqual) {
          console.warn('API version incompatible');
          get().clearAllStates();
          return;
        }
      } else {
        console.warn('Backend is not reachable');
        get().clearAllStates();
        return;
      }

      const [
        imageHistoryResponse,
        sequenceResponse,
        cameraResponse,
        mountResponse,
        filterResponse,
        rotatorResponse,
        focuserResponse,
        focuserAfResponse,
        guiderResponse,
        flatdeviceResponse,
        domeResponse,
        guiderChartResponse,
        safetyResponse,
        weatherResponse,
        switchResponse,
      ] = await Promise.all([
        apiService.imageHistoryAll(),
        apiService.sequenceAction('json'),
        apiService.cameraAction('info'),
        apiService.mountAction('info'),
        apiService.filterAction('info'),
        apiService.rotatorAction('info'),
        apiService.focusAction('info'),
        apiService.focuserAfAction('info'),
        apiService.guiderAction('info'),
        apiService.flatdeviceAction('info'),
        apiService.domeAction('info'),
        apiService.guiderAction('graph'),
        apiService.safetyAction('info'),
        apiService.weatherAction('info'),
        apiService.switchAction('info'),
      ]);

      get().handleApiResponses({
        imageHistoryResponse,
        sequenceResponse,
        cameraResponse,
        mountResponse,
        filterResponse,
        rotatorResponse,
        focuserResponse,
        focuserAfResponse,
        guiderResponse,
        flatdeviceResponse,
        domeResponse,
        guiderChartResponse,
        safetyResponse,
        weatherResponse,
        switchResponse,
      });
    } catch (error) {
      console.error('Fehler beim Abrufen der Informationen:', error);
    }
    await get().fetchProfilInfos();
  },

  clearAllStates: () => {
    set({
      intervalId: null,
      intervalIdGraph: null,
      profileInfo: [],
      sequenceInfo: [],
      collapsedStates: {},
      cameraInfo: { IsExposing: false },
      mountInfo: [],
      filterInfo: [],
      focuserInfo: [],
      rotatorInfo: [],
      focuserAfInfo: [],
      guiderInfo: [],
      flatdeviceInfo: [],
      domeInfo: [],
      safetyInfo: {
        Connected: false,
        IsSafe: false,
      },
      switchInfo: [],
      weatherInfo: [],
      RADistanceRaw: [],
      DECDistanceRaw: [],
      isBackendReachable: false,
      filterName: 'unbekannt',
      filterNr: null,
      showAfGraph: true,
      imageData: null,
      isLoadingImage: false,
      captureRunning: false,
      rotatorMechanicalPosition: 0,
      sequenceIsLoaded: false,
      sequenceRunning: false,
      existingEquipmentList: [],
      coordinates: null,
      currentLanguage: 'en',
    });
  },

  handleApiResponses: ({
    imageHistoryResponse,
    sequenceResponse,
    cameraResponse,
    mountResponse,
    filterResponse,
    rotatorResponse,
    focuserResponse,
    focuserAfResponse,
    guiderResponse,
    flatdeviceResponse,
    domeResponse,
    guiderChartResponse,
    safetyResponse,
    weatherResponse,
    switchResponse,
  }) => {
    if (imageHistoryResponse.Success) {
      set({ imageHistoryInfo: imageHistoryResponse.Response });
    } else {
      set({ sequenceIsLoaded: false });
      console.error('Fehler in der Sequence-API-Antwort:', sequenceResponse.Error);
    }

    if (sequenceResponse.Success) {
      set({ sequenceInfo: sequenceResponse.Response });
      set({ sequenceIsLoaded: true });
      const isRunning = sequenceResponse.Response?.some((sequence) =>
        sequence.Items?.some((item) => item.Status === 'RUNNING')
      );
      set({ sequenceRunning: isRunning || false });
    } else {
      set({ sequenceIsLoaded: false });
      set({ sequenceRunning: false });
    }

    if (cameraResponse.Success) {
      set({ cameraInfo: cameraResponse.Response });
    } else {
      console.error('Fehler in der Kamera-API-Antwort:', cameraResponse.Error);
    }

    if (mountResponse.Success) {
      set({ mountInfo: mountResponse.Response });
    } else {
      console.error('Fehler in der Mount-API-Antwort:', mountResponse.Error);
    }

    if (filterResponse.Success) {
      set({ filterInfo: filterResponse.Response });
    } else {
      console.error('Fehler in der Filter-API-Antwort:', filterResponse.Error);
    }

    if (rotatorResponse.Success) {
      set({ rotatorInfo: rotatorResponse.Response });
    } else {
      console.error('Fehler in der Rotator-API-Antwort:', rotatorResponse.Error);
    }

    if (focuserResponse.Success) {
      set({ focuserInfo: focuserResponse.Response });
    } else {
      console.error('Fehler in der Focuser-API-Antwort:', focuserResponse.Error);
    }

    if (focuserAfResponse.Success) {
      set({ focuserAfInfo: focuserAfResponse });
    } else {
      console.error('Fehler in der Focuser-AF-API-Antwort:', focuserAfResponse.Error);
    }

    if (safetyResponse.Success) {
      set({ safetyInfo: safetyResponse.Response });
    } else {
      console.error('Fehler in der Safety-API-Antwort:', safetyResponse.Error);
    }

    if (guiderResponse.Success) {
      set({ guiderInfo: guiderResponse.Response });
    } else {
      console.error('Fehler in der Guider-API-Antwort:', guiderResponse.Error);
    }

    if (flatdeviceResponse.Success) {
      set({ flatdeviceInfo: flatdeviceResponse.Response });
    } else {
      console.error('Fehler in der Flat-API-Antwort:', flatdeviceResponse.Error);
    }

    if (domeResponse.Success) {
      set({ domeInfo: domeResponse.Response });
    } else {
      console.error('Fehler in der Flat-API-Antwort:', domeResponse.Error);
    }

    if (guiderChartResponse.Success) {
      get().processGuiderChartDataApi(guiderChartResponse.Response);
      set({ guiderChartInfo: guiderChartResponse.Response });
    } else {
      console.error('Fehler in der Guider-Chart-API-Antwort:', guiderChartResponse);
    }

    if (weatherResponse.Success) {
      set({ weatherInfo: weatherResponse.Response });
    } else {
      console.error('Fehler in der Weather-API-Antwort:', weatherResponse.Error);
    }

    if (switchResponse.Success) {
      set({ switchInfo: switchResponse.Response });
    } else {
      console.error('Fehler in der Switch-API-Antwort:', switchResponse.Error);
    }
  },

  processGuiderChartDataApi: (data) => {
    if (!Array.isArray(data?.GuideSteps)) {
      console.warn('Invalid GuideSteps, initializing as an empty array.');
      set({ RADistanceRaw: [] });
      set({ DECDistanceRaw: [] });
      return;
    }
    set({
      RADistanceRaw: data.GuideSteps.map((step) =>
        typeof step.RADistanceRaw === 'number' ? step.RADistanceRawDisplay : 0
      ),
    });

    set({
      DECDistanceRaw: data.GuideSteps.map((step) =>
        typeof step.DECDistanceRaw === 'number' ? step.DECDistanceRawDisplay : 0
      ),
    });
  },

  startFetchingInfo: () => {
    if (!get().intervalId) {
      set({ intervalId: setInterval(get().fetchAllInfos, 2000) });
    }
  },

  stopFetchingInfo: () => {
    if (get().intervalId) {
      clearInterval(get().intervalId);
      set({ intervalId: null });
    }
  },

  fetchProfilInfos: async () => {
    try {
      if (!get().isBackendReachable) {
        console.warn('Backend ist nicht erreichbar');
        return;
      }

      const profileInfoResponse = await apiService.profileAction('show?active=true');

      if (profileInfoResponse && profileInfoResponse.Response) {
        set({ profileInfo: profileInfoResponse.Response });
        get().getExistingEquipment(get().profileInfo);
      } else {
        console.error('Fehler in der Profil-API-Antwort:', profileInfoResponse?.Error);
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Profilinformationen:', error);
    }
  },

  getExistingEquipment: (activeProfile) => {
    const existingEquipmentList = [];
    const apiMapping = {
      CameraSettings: 'camera',
      DomeSettings: 'dome',
      FilterWheelSettings: 'filter',
      FocuserSettings: 'focuser',
      SwitchSettings: 'switch',
      TelescopeSettings: 'mount',
      SafetyMonitorSettings: 'safety',
      FlatDeviceSettings: 'flatdevice',
      RotatorSettings: 'rotator',
      WeatherDataSettings: 'weather',
      GuiderSettings: 'guider',
    };
    const keysToCheck = Object.keys(apiMapping);

    keysToCheck.forEach((key) => {
      if (activeProfile && activeProfile[key]) {
        const device = activeProfile[key];

        if (key === 'GuiderSettings') {
          if (device.GuiderName && device.GuiderName !== 'No_Guider') {
            existingEquipmentList.push({
              type: key,
              id: device.GuiderName,
              apiName: apiMapping[key],
            });
          }
        } else if (key === 'RotatorSettings') {
          if (device.Id !== 'Manual Rotator' && device.Id !== 'No_Device') {
            existingEquipmentList.push({
              type: key,
              id: device.Id,
              apiName: apiMapping[key],
            });
          }
        } else if (key === 'FilterWheelSettings') {
          if (device.Id !== 'Manual Filter Wheel' && device.Id !== 'No_Device') {
            existingEquipmentList.push({
              type: key,
              id: device.Id,
              apiName: apiMapping[key],
            });
          }
        } else if (device.Id && device.Id !== 'No_Device') {
          existingEquipmentList.push({
            type: key,
            id: device.Id,
            apiName: apiMapping[key],
          });
        }
      }
    });
    set({ existingEquipmentList });
  },

  setDefaultCameraSettings: () => {
    const cStore = useCameraStore();
    const cameraSettings = get().profileInfo?.CameraSettings || {};
    cStore.set({
      coolingTemp: cameraSettings.Temperature ?? -10,
      coolingTime: cameraSettings.CoolingDuration ?? 10,
      warmingTime: cameraSettings.WarmingDuration ?? 10,
    });
    console.log(
      'Kameraeinstellungen gesetzt:',
      cStore.coolingTemp,
      cStore.coolingTime,
      cStore.warmingTime
    );
  },

  setDefaultRotatorSettings: () => {
    set({ rotatorMechanicalPosition: get().rotatorInfo?.MechanicalPosition ?? 0 });
    console.log('Rotatoreinstellung gesetzt:', get().rotatorMechanicalPosition);
  },

  setDefaultCoordinates: () => {
    const cStore = useSettingsStore();
    cStore.set({
      coordinates: {
        longitude: get().profileInfo.AstrometrySettings.Longitude,
        latitude: get().profileInfo.AstrometrySettings.Latitude,
        altitude: get().profileInfo.AstrometrySettings.Elevation,
      },
    });
  },

  checkVersionNewerOrEqual: (currentVersion, minimumVersion) => {
    const parseVersion = (version) => version.split('.').map(Number);

    const currentParts = parseVersion(currentVersion);
    const minimumParts = parseVersion(minimumVersion);

    for (let i = 0; i < minimumParts.length; i++) {
      const current = currentParts[i] || 0;
      const minimum = minimumParts[i] || 0;

      if (current > minimum) {
        set({ isVersionNewerOrEqual: true });
        return true;
      }
      if (current < minimum) {
        set({ isVersionNewerOrEqual: false });
        return false;
      }
    }
    set({ isVersionNewerOrEqual: true });
    return true;
  },
}));

export default useApiStore;
