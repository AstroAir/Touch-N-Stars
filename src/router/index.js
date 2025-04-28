import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import StartPage from '@/views/StartPage';
import EquipmentPage from '@/views/EquipmentPage';
import CameraPage from '@/views/CameraPage';
import FocusPage from '@/views/FocusPage';
import MountPage from '@/views/MountPage';
import GuidingPage from '@/views/GuidingPage';
import LastLogs from '@/components/LastLogs';
import SequencePage from '@/views/SequencePage';
import DomePage from '@/views/DomePage';
import SettingsPage from '@/views/SettingsPage';
import FlatdevicePage from '@/views/FlatdevicePage';
import SequenceMonitoring from '@/views/SequenceMonitoring';
import SetupPage from '@/views/SetupPage';
import SwitchPage from '@/views/SwitchPage';
import Flatassistant from '@/views/FlatassistantPage';
import { useSettingsStore } from '@/store/settingsStore';

const routes = [
  {
    path: '/',
    component: StartPage,
    meta: { requiresSetup: true },
  },
  {
    path: '/setup',
    component: SetupPage,
    meta: { requiresSetup: false },
  },
  { path: '/equipment', component: EquipmentPage, meta: { requiresSetup: true } },
  { path: '/camera', component: CameraPage, meta: { requiresSetup: true } },
  { path: '/autofocus', component: FocusPage, meta: { requiresSetup: true } },
  { path: '/mount', component: MountPage, meta: { requiresSetup: true } },
  { path: '/guider', component: GuidingPage, meta: { requiresSetup: true } },
  { path: '/logs', component: LastLogs, meta: { requiresSetup: true } },
  { path: '/sequence', component: SequencePage, meta: { requiresSetup: true } },
  { path: '/dome', component: DomePage, meta: { requiresSetup: true } },
  { path: '/settings', component: SettingsPage, meta: { requiresSetup: true } },
  { path: '/flat', component: FlatdevicePage, meta: { requiresSetup: true } },
  { path: '/seq-mon', component: SequenceMonitoring, meta: { requiresSetup: true } },
  { path: '/switch', component: SwitchPage, meta: { requiresSetup: true } },
  { path: '/flats', component: Flatassistant, meta: { requiresSetup: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const settingsStore = useSettingsStore();

  if (to.meta.requiresSetup && !settingsStore.isSetupComplete()) {
    next('/setup');
  } else if (to.path === '/setup' && settingsStore.isSetupComplete()) {
    next('/');
  } else {
    next();
  }
});

export default router;
