import axios from "axios";
import { getActivePinia } from 'pinia';

let settingsStore;

const initializeStore = () => {
  if (!settingsStore) {
    const pinia = getActivePinia();
    if (!pinia) {
      throw new Error('Pinia store not initialized');
    }
    settingsStore = pinia._s.get('settings');
    
    // Watch for connection changes
    settingsStore.$onAction(({ name }) => {
      if (name === 'setConnection') {
        // Connection changed - URLs will be regenerated on next request
      }
    });
  }
};

const getBaseUrl = () => {
  initializeStore();
  const protocol = settingsStore.backendProtocol || "http";
  const host = settingsStore.connection.ip || window.location.hostname;
  const port = settingsStore.connection.port || 5000;
  const apiPort =  1888;
  
  return {
    base: `${protocol}://${host}:${apiPort}/v2/api`,
    api: `${protocol}://${host}:${port}/api/`,
    targetpic: `${protocol}://${host}:${port}/api/targetpic`
  };
};

const getUrls = () => {
  const urls = getBaseUrl();
  return {
    BASE_URL: urls.base,
    API_URL: urls.api,
    TARGETPIC_URL: urls.targetpic
  };
};

const apiService = {
  // Backend reachability check
  async isBackendReachable() {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/version`);
      return response.status === 200;
    } catch (error) {
      console.error("Error reaching backend:", error.message);
      return false;
    }
  },

  //-------------------------------------  Image History ---------------------------------------
  async imageHistoryAll() {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/image-history`, {
        params: { all: true, },
      });
      return response.data;
    } catch (error) {
      console.error("Error read Image History:", error);
      throw error;
    }
  },

  //-------------------------------------  Image  ---------------------------------------
  async getSequenceImage(index, quality, resize, scale) {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/image/${index}`, {
        params: {
          quality: quality,
          resize: resize,
          scale: scale,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error read Image :", error);
      throw error;
    }
  },

  //-------------------------------------  sequence ---------------------------------------
  sequenceAction(action) {
    const { BASE_URL } = getUrls();
    if (action === "start") {
      return this._simpleGetRequest(`${BASE_URL}/sequence/start?skipValidation=true`)
        .then(response => ({
          ...response,
          Response: 'Sequence start',
          Success: true
        }));
    }
    return this._simpleGetRequest(`${BASE_URL}/sequence/${action}`);
  },

  //-------------------------------------  Mount ---------------------------------------
  mountAction(action) {
    const { BASE_URL } = getUrls();
    return this._simpleGetRequest(`${BASE_URL}/equipment/mount/${action}`);
  },

  async setTrackingMode(TrackingMode) {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/equipment/mount/tracking`, {
        params: { mode: TrackingMode, },
      });
      return response.data;
    } catch (error) {
      console.error("Error switch profil:", error);
      throw error;
    }
  },

  //-------------------------------------  profile ---------------------------------------
  profileAction(action) {
    const { BASE_URL } = getUrls();
    return this._simpleGetRequest(`${BASE_URL}/profile/${action}`);
  },

  //   change-value
  async profileChangeValue(settingpath,newValue) {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/profile/change-value`, {
        params: { 
          settingpath, 
          newValue, 
        },
      });
      //console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error switch profil:", error);
      throw error;
    }
  },

  // Profil Switch
  async profileSwitch(profileid) {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/profile/switch`, {
        params: { profileid: profileid, },
      });
      return response.data;
    } catch (error) {
      console.error("Error switch profil:", error);
      throw error;
    }
  },

  //-------------------------------------  application ---------------------------------------
  async applicatioTabSwitch(tab) {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/application/switch-tab`, {
        params: { tab: tab, },
      });
      return response.data;
    } catch (error) {
      console.error("Error open application:", error);
      throw error;
    }
  },

  //-------------------------------------  Camera ---------------------------------------
  cameraAction(action) {
    const { BASE_URL } = getUrls();
    return this._simpleGetRequest(`${BASE_URL}/equipment/camera/${action}`);
  },

  async startCapture(duration, gain) {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/equipment/camera/capture`, {
        params: {
          duration: duration,
          gain: gain
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error starting capture:", error);
      throw error;
    }
  },

  async getCaptureResult() {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/equipment/camera/capture`, {
        params: { getResult: true, quality: 80 },
      });
      return response.data;
    } catch (error) {
      console.error("Error retrieving capture result:", error);
      throw error;
    }
  },

  async startCooling(temp, minutes) {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/equipment/camera/cool`, {
        params: {
          temperature: temp,
          minutes: minutes
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error retrieving capture result:", error);
      throw error;
    }
  },

  async stoppCooling() {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/equipment/camera/cool`, {
        params: { cancel: true },
      });
      return response.data;
    } catch (error) {
      console.error("Error retrieving capture result:", error);
      throw error;
    }
  },

  async startStoppWarming(cancel, minutes) {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/equipment/camera/warm`, {
        params: {
          cancel: cancel,
          minutes: minutes
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error retrieving capture result:", error);
      throw error;
    }
  },

  async startStoppDewheater(power) {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/equipment/camera/dew-heater`, {
        params: { power: power },
      });
      return response.data;
    } catch (error) {
      console.error("Error retrieving capture result:", error);
      throw error;
    }
  },

  //-------------------------------------  Filterwheel ---------------------------------------
  filterAction(action) {
    const { BASE_URL } = getUrls();
    return this._simpleGetRequest(`${BASE_URL}/equipment/filterwheel/${action}`);
  },

  async changeFilter(filterNr) {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/equipment/filterwheel/change-filter`, {
        params: { filterId: filterNr },
      });
      return response.data;
    } catch (error) {
      console.error("Error changing filter:", error);
      throw error;
    }
  },

  //-------------------------------------  Rotator ---------------------------------------
  rotatorAction(action) {
    const { BASE_URL } = getUrls();
    return this._simpleGetRequest(`${BASE_URL}/equipment/rotator/${action}`);
  },

  async moveRotator(position) {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/equipment/rotator/move`, {
        params: { position: position },
      });
      return response.data;
    } catch (error) {
      console.error("Error moving Rotator:", error);
      throw error;
    }
  },

  async moveMechanicalRotator(position) {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/equipment/rotator/move-mechanical`, {
        params: { position: position },
      });
      return response.data;
    } catch (error) {
      console.error("Error moving mechanical Rotator:", error);
      throw error;
    }
  },

  //-------------------------------------  flatdevice ---------------------------------------
  flatdeviceAction(action) {
    const { BASE_URL } = getUrls();
    return this._simpleGetRequest(`${BASE_URL}/equipment/flatdevice/${action}`);
  },

  //-------------------------------------  dome ---------------------------------------
  domeAction(action) {
    const { BASE_URL } = getUrls();
    return this._simpleGetRequest(`${BASE_URL}/equipment/dome/${action}`);
  },

  //-------------------------------------  focuser ---------------------------------------
  focusAction(action) {
    const { BASE_URL } = getUrls();
    return this._simpleGetRequest(`${BASE_URL}/equipment/focuser/${action}`);
  },

  focuserAfAction(action) {
    const { API_URL } = getUrls();
    return this._simpleGetRequest(`${API_URL}autofocus?${action}`);
  },

  focuserLastAf() {
    const { BASE_URL } = getUrls();
    return this._simpleGetRequest(`${BASE_URL}/equipment/focuser/last-af`);
  },

  async moveFocuser(position) {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/equipment/focuser/move`, {
        params: { position },
      });
      return response.data;
    } catch (error) {
      console.error("Error moving focuser:", error);
      throw error;
    }
  },

  //-------------------------------------  Switch ----------------------------------------
  switchAction(action) {
    const { BASE_URL } = getUrls();
    return this._simpleGetRequest(`${BASE_URL}/equipment/switch/${action}`);
  },

  //-------------------------------------  Weather ----------------------------------------
  weatherAction(action) {
    const { BASE_URL } = getUrls();
    return this._simpleGetRequest(`${BASE_URL}/equipment/weather/${action}`);
  },

  //-------------------------------------  Framing ---------------------------------------
  framingAction(action) {
    const { BASE_URL } = getUrls();
    return this._simpleGetRequest(`${BASE_URL}/framing/${action}`);
  },

  async setFramingImageSource(source) {
    try {
      const { BASE_URL } = getUrls();
      const response = await axios.get(`${BASE_URL}/framing/set-source`, {
        params: { source },
      });
      return response.data;
    } catch (error) {
      console.error("Error controlling setFramingImageSource:", error);
      throw error;
    }
  },

  async slewAndCenter(RAangle, DECangle, Center) {
    try {
      const { BASE_URL } = getUrls();
      await axios.get(`${BASE_URL}/framing/set-coordinates`, {
        params: { RAangle, DECangle },
      });

      await new Promise((resolve) => setTimeout(resolve, 4000));

      const params = Center ? { slew_option: "Center" } : {};
      const response = await axios.get(`${BASE_URL}/framing/slew`, { params });
      return response.data;
    } catch (error) {
      console.error("Error controlling mount:", error);
      throw error;
    }
  },

  async searchNGC(query, limit = 10) {
    const { API_URL } = getUrls();
    return this._getWithParams(`${API_URL}ngc/search`, { query, limit });
  },

  async getNgcCache() {
    const { API_URL } = getUrls();
    return this._simpleGetRequest(`${API_URL}ngc/cache`);
  },

  async updateNgcCache(data) {
    try {
      const { API_URL } = getUrls();
      const response = await axios.post(`${API_URL}ngc/cache`, { data });
      return response.data;
    } catch (error) {
      console.error("Error updating NGC cache:", error);
      throw error;
    }
  },

  async searchTargetPic(width, height, fov, ra, dec) {
    try {
      const { TARGETPIC_URL } = getUrls();
      const response = await axios.get(TARGETPIC_URL, {
        params: { width, height, fov, ra, dec, hips: "CDS/P/DSS2/color", projection: "STG", format: "jpg" },
        responseType: "blob",
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error retrieving target picture:", error);
      throw error;
    }
  },

  //-------------------------------------  guider ---------------------------------------
  guiderAction(action) {
    const { BASE_URL } = getUrls();
    return this._simpleGetRequest(`${BASE_URL}/equipment/guider/${action}`);
  },

  async fetchGuiderChartData() {
    try {
      const { API_URL } = getUrls();
      const response = await axios.get(`${API_URL}guider-data`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error fetching guider data:", error);
      return { success: false, message: "Error fetching guider data" };
    }
  },

  //-------------------------------------  safety ---------------------------------------
  safetyAction(action) {
    const { BASE_URL } = getUrls();
    return this._simpleGetRequest(`${BASE_URL}/equipment/safetymonitor/${action}`);
  },

  //-------------------------------------  Logs ---------------------------------------
  async getLastLogs(count, level) {
    try {
      const { API_URL } = getUrls();
      const response = await axios.get(`${API_URL}logs`, {
        params: { count, level },
      });
      return response.data;
    } catch (error) {
      console.error("Error retrieving logs result:", error);
      throw error;
    }
  },

  //-------------------------------------  Helper ---------------------------------------
  _simpleGetRequest(url) {
    return axios
      .get(url)
      .then((response) => response.data)
      .catch((error) => {
        console.error(`Error in GET request to ${url}:`, error);
        throw error;
      });
  },

  _getWithParams(url, params) {
    return axios
      .get(url, { params })
      .then((response) => response.data)
      .catch((error) => {
        console.error(`Error in GET request to ${url} with params:`, error);
        throw error;
      });
  },
};

export default apiService;
