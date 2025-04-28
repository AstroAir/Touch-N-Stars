import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavigationComp from './components/NavigationComp';
import SubNav from './components/SubNav';
import CameraPage from './views/CameraPage';
import DomePage from './views/DomePage';
import EquipmentPage from './views/EquipmentPage';
import FlatdevicePage from './views/FlatdevicePage';
import SettingsModal from './components/SettingsModal';
import LogsModal from './components/LogsModal';
import TutorialModal from './components/TutorialModal';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <Router>
      <div className="app">
        <NavigationComp />
        <SubNav />
        <Switch>
          <Route path="/camera" component={CameraPage} />
          <Route path="/dome" component={DomePage} />
          <Route path="/equipment" component={EquipmentPage} />
          <Route path="/flatdevice" component={FlatdevicePage} />
          {/* Add more routes as needed */}
        </Switch>
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {showLogs && <LogsModal onClose={() => setShowLogs(false)} />}
        {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
      </div>
    </Router>
  );
}

export default App;
