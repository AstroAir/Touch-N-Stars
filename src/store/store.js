import { defineStore } from 'pinia';
import apiService from '@/services/apiService';
import { useCameraStore } from '@/store/cameraStore';
import { useSettingsStore } from '@/store/settingsStore';

export const apiStore = defineStore('store', {
  state: () => ({
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
    showSettings: false,
  }),

  actions: {
    setSequenceRunning(isRunning) {
      this.sequenceRunning = isRunning;
    },
    toggleCollapsedState(containerName) {
      this.collapsedStates = {
        ...this.collapsedStates,
        [containerName]: !this.collapsedStates[containerName],
      };
    },

    isCollapsed(containerName) {
      return !!this.collapsedStates[containerName];
    },

    async fetchAllInfos() {
      try {
        this.isBackendReachable = await apiService.isBackendReachable();
        //console.log('Backend erreichbar');
        if (!this.isBackendReachable) {
          //console.warn('Backend ist nicht erreichbar');
          this.clearAllStates();
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
          apiService.fetchGuiderChartData(),
          apiService.safetyAction('info'),
          apiService.weatherAction('info'),
          apiService.switchAction('info'),
        ]);

        this.handleApiResponses({
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
          //logsResponse,
        });
      } catch (error) {
        console.error('Fehler beim Abrufen der Informationen:', error);
      }
      await this.fetchProfilInfos();
    },

    clearAllStates() {
      this.intervalId = null;
      this.intervalIdGraph = null;
      this.profileInfo = [];
      this.sequenceInfo = [];
      this.collapsedStates = {};
      this.cameraInfo = { IsExposing: false };
      this.mountInfo = [];
      this.filterInfo = [];
      this.focuserInfo = [];
      this.rotatorInfo = [];
      this.focuserAfInfo = [];
      this.guiderInfo = [];
      this.flatdeviceInfo = [];
      this.domeInfo = [];
      this.safetyInfo = {
        Connected: false,
        IsSafe: false,
      };
      this.switchInfo = [];
      this.weatherInfo = [];
      this.RADistanceRaw = [];
      this.DECDistanceRaw = [];
      this.isBackendReachable = false;
      this.filterName = 'unbekannt';
      this.filterNr = null;
      this.showAfGraph = true;
      this.imageData = null;
      this.isLoadingImage = false;
      this.captureRunning = false;
      this.rotatorMechanicalPosition = 0;
      this.sequenceIsLoaded = false;
      this.sequenceRunning = false;
      this.existingEquipmentList = [];
      this.coordinates = null;
      this.currentLanguage = 'en';
    },

    handleApiResponses({
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
    }) {
      if (imageHistoryResponse.Success) {
        this.imageHistoryInfo = imageHistoryResponse.Response;
      } else {
        this.sequenceIsLoaded = false;
        console.error('Fehler in der Sequence-API-Antwort:', sequenceResponse.Error);
      }

      if (sequenceResponse.Success) {
        this.sequenceInfo = sequenceResponse.Response;
        this.sequenceIsLoaded = true;
        // Check if sequence is running
        // Check if any sequence is running by searching for RUNNING status
        const isRunning = sequenceResponse.Response?.some((sequence) =>
          sequence.Items?.some((item) => item.Status === 'RUNNING')
        );
        this.sequenceRunning = isRunning || false;
      } else {
        this.sequenceIsLoaded = false;
        this.sequenceRunning = false;
      }

      if (cameraResponse.Success) {
        this.cameraInfo = cameraResponse.Response;
      } else {
        console.error('Fehler in der Kamera-API-Antwort:', cameraResponse.Error);
      }

      if (mountResponse.Success) {
        this.mountInfo = mountResponse.Response;
      } else {
        console.error('Fehler in der Mount-API-Antwort:', mountResponse.Error);
      }

      if (filterResponse.Success) {
        this.filterInfo = filterResponse.Response;
      } else {
        console.error('Fehler in der Filter-API-Antwort:', filterResponse.Error);
      }

      if (rotatorResponse.Success) {
        this.rotatorInfo = rotatorResponse.Response;
      } else {
        console.error('Fehler in der Rotator-API-Antwort:', rotatorResponse.Error);
      }

      if (focuserResponse.Success) {
        this.focuserInfo = focuserResponse.Response;
      } else {
        console.error('Fehler in der Focuser-API-Antwort:', focuserResponse.Error);
      }

      if (focuserAfResponse.Success) {
        this.focuserAfInfo = focuserAfResponse;
      } else {
        console.error('Fehler in der Focuser-AF-API-Antwort:', focuserAfResponse.Error);
      }

      if (safetyResponse.Success) {
        this.safetyInfo = safetyResponse.Response;
      } else {
        console.error('Fehler in der Safety-API-Antwort:', safetyResponse.Error);
      }

      if (guiderResponse.Success) {
        this.guiderInfo = guiderResponse.Response;
        //console.log(this.guiderInfo);
      } else {
        console.error('Fehler in der Guider-API-Antwort:', guiderResponse.Error);
      }

      if (flatdeviceResponse.Success) {
        this.flatdeviceInfo = flatdeviceResponse.Response;
      } else {
        console.error('Fehler in der Flat-API-Antwort:', flatdeviceResponse.Error);
      }

      if (domeResponse.Success) {
        this.domeInfo = domeResponse.Response;
      } else {
        console.error('Fehler in der Flat-API-Antwort:', domeResponse.Error);
      }

      if (guiderChartResponse.success) {
        this.processGuiderChartData(guiderChartResponse.data);
      } else {
        console.error('Fehler in der Guider-Chart-API-Antwort:', guiderChartResponse);
      }

      if (weatherResponse.Success) {
        this.weatherInfo = weatherResponse.Response;
      } else {
        console.error('Fehler in der Weather-API-Antwort:', weatherResponse.Error);
      }

      if (switchResponse.Success) {
        this.switchInfo = switchResponse.Response;
      } else {
        console.error('Fehler in der Switch-API-Antwort:', switchResponse.Error);
      }
    },

    processGuiderChartData(data) {
      if (!Array.isArray(data?.RADistanceRaw)) {
        console.warn('Invalid RADistanceRaw, initializing as an empty array.');
        data.RADistanceRaw = [];
      }
      if (!Array.isArray(data?.DECDistanceRaw)) {
        console.warn('Invalid DECDistanceRaw, initializing as an empty array.');
        data.DECDistanceRaw = [];
      }

      this.RADistanceRaw = data.RADistanceRaw.map((value) =>
        typeof value === 'number' ? value : 0
      );
      this.DECDistanceRaw = data.DECDistanceRaw.map((value) =>
        typeof value === 'number' ? value : 0
      );
    },

    startFetchingInfo() {
      if (!this.intervalId) {
        this.intervalId = setInterval(this.fetchAllInfos, 2000);
      }
    },

    stopFetchingInfo() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },

    async fetchProfilInfos() {
      try {
        if (!this.isBackendReachable) {
          console.warn('Backend ist nicht erreichbar');
          return;
        }

        const profileInfoResponse = await apiService.profileAction('show?active=true');

        if (profileInfoResponse && profileInfoResponse.Response) {
          this.profileInfo = profileInfoResponse.Response;
          //console.log('Profilinformationen abgerufen:', this.profileInfo);
          this.getExistingEquipment(this.profileInfo);
        } else {
          console.error('Fehler in der Profil-API-Antwort:', profileInfoResponse?.Error);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Profilinformationen:', error);
      }
    },

    getExistingEquipment(activeProfile) {
      this.existingEquipmentList = [];
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
              this.existingEquipmentList.push({
                type: key,
                id: device.GuiderName,
                apiName: apiMapping[key],
              });
            }
          } else if (device.Id && device.Id !== 'No_Device') {
            this.existingEquipmentList.push({
              type: key,
              id: device.Id,
              apiName: apiMapping[key],
            });
          }
        }
      });
      //console.log(this.existingEquipmentList);
    },

    setDefaultCameraSettings() {
      const cStore = useCameraStore();
      const cameraSettings = this.profileInfo?.CameraSettings || {};
      cStore.coolingTemp = cameraSettings.Temperature ?? -10;
      cStore.coolingTime = cameraSettings.CoolingDuration ?? 10;
      cStore.warmingTime = cameraSettings.WarmingDuration ?? 10;
      cStore.gain = cameraSettings.Gain ?? 0;
      cStore.buttonCoolerOn = this.cameraInfo?.CoolerOn ?? false;
      cStore.offset = cameraSettings.Offset ?? 0;
      console.log(
        'Kameraeinstellungen gesetzt:',
        cStore.coolingTemp,
        cStore.coolingTime,
        cStore.warmingTime,
        cStore.gain,
        cStore.offset
      );
    },
    setDefaultRotatorSettings() {
      this.rotatorMechanicalPosition = this.rotatorInfo?.MechanicalPosition ?? 0;
      console.log('Rotatoreinstellung gesetzt:', this.rotatorMechanicalPosition);
    },
    setDefaultCoordinates() {
      const cStore = useSettingsStore();
      cStore.coordinates.longitude = this.profileInfo.AstrometrySettings.Longitude;
      cStore.coordinates.latitude = this.profileInfo.AstrometrySettings.Latitude;
      cStore.coordinates.altitude = this.profileInfo.AstrometrySettings.Elevation;
    },
  },
});
