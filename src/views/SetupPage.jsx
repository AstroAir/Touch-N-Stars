import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSettingsStore } from '../store/settingsStore';

const SetupPage = () => {
  const history = useHistory();
  const settingsStore = useSettingsStore();
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState('en');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [altitude, setAltitude] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('');

  const handleNext = () => {
    if (step === 4) {
      settingsStore.completeSetup();
      history.push('/');
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    settingsStore.setLanguage(e.target.value);
  };

  const handleGpsConfig = () => {
    settingsStore.setCoordinates({ latitude, longitude, altitude });
  };

  const handleInstanceConfig = () => {
    settingsStore.setConnection({ ip, port });
  };

  return (
    <div className="setup-page">
      {step === 0 && (
        <div className="step">
          <h2>Welcome</h2>
          <p>Welcome to the setup wizard. Click next to continue.</p>
        </div>
      )}
      {step === 1 && (
        <div className="step">
          <h2>Language Selection</h2>
          <label>
            Select Language:
            <select value={language} onChange={handleLanguageChange}>
              <option value="en">English</option>
              <option value="cn">Chinese</option>
              <option value="de">German</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
            </select>
          </label>
        </div>
      )}
      {step === 2 && (
        <div className="step">
          <h2>GPS Configuration</h2>
          <label>
            Latitude:
            <input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </label>
          <label>
            Longitude:
            <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </label>
          <label>
            Altitude:
            <input
              type="text"
              value={altitude}
              onChange={(e) => setAltitude(e.target.value)}
            />
          </label>
          <button onClick={handleGpsConfig}>Save GPS Configuration</button>
        </div>
      )}
      {step === 3 && (
        <div className="step">
          <h2>Instance Configuration</h2>
          <label>
            IP Address:
            <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} />
          </label>
          <label>
            Port:
            <input type="text" value={port} onChange={(e) => setPort(e.target.value)} />
          </label>
          <button onClick={handleInstanceConfig}>Save Instance Configuration</button>
        </div>
      )}
      {step === 4 && (
        <div className="step">
          <h2>Complete Setup</h2>
          <p>Setup is complete. Click finish to start using the application.</p>
        </div>
      )}
      <div className="navigation-buttons">
        {step > 0 && <button onClick={handleBack}>Back</button>}
        <button onClick={handleNext}>{step === 4 ? 'Finish' : 'Next'}</button>
      </div>
    </div>
  );
};

export default SetupPage;
