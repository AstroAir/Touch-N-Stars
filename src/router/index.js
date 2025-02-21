import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import StartPage from '@/views/StartPage.jsx';
import EquipmentPage from '@/views/EquipmentPage.jsx';
import CameraPage from '@/views/CameraPage.jsx';
import FocusPage from '@/views/FocusPage.jsx';
import MountPage from '@/views/MountPage.jsx';
import GuidingPage from '@/views/GuidingPage.jsx';
import LastLogs from '@/components/LastLogs.jsx';
import SequencePage from '@/views/SequencePage.jsx';
import DomePage from '@/views/DomePage.jsx';
import SettingsPage from '@/views/SettingsPage.jsx';
import FlatdevicePage from '@/views/FlatdevicePage.jsx';
import SequenceMonitoring from '@/views/SequenceMonitoring.jsx';
import SetupPage from '@/views/SetupPage.jsx';
import SwitchPage from '@/views/SwitchPage.jsx';
import { useSettingsStore } from '@/store/settingsStore';

const AppRouter = () => {
  const settingsStore = useSettingsStore();

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={StartPage} />
        <Route path="/setup" component={SetupPage} />
        <Route path="/equipment" component={EquipmentPage} />
        <Route path="/camera" component={CameraPage} />
        <Route path="/autofocus" component={FocusPage} />
        <Route path="/mount" component={MountPage} />
        <Route path="/guider" component={GuidingPage} />
        <Route path="/logs" component={LastLogs} />
        <Route path="/sequence" component={SequencePage} />
        <Route path="/dome" component={DomePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/flat" component={FlatdevicePage} />
        <Route path="/seq-mon" component={SequenceMonitoring} />
        <Route path="/switch" component={SwitchPage} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
