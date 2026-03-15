/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import Starfield from './components/effects/Starfield';
import NebulaLayer from './components/effects/NebulaLayer';
import CursorTrail from './components/effects/CursorTrail';
import HUDBar from './components/navigation/HUDBar';
import ShipProgress from './components/navigation/ShipProgress';
import GalaxyMap from './components/navigation/GalaxyMap';
import LaunchSection from './components/sections/LaunchSection';
import AboutPlanet from './components/sections/AboutPlanet';
import SkillsGalaxy from './components/sections/SkillsGalaxy';
import ProjectsUniverse from './components/sections/ProjectsUniverse';
import JourneyAsteroids from './components/sections/JourneyAsteroids';
import ContactStation from './components/sections/ContactStation';
import HyperspaceLoader from './components/effects/HyperspaceLoader';
import { SettingsProvider, useSettings } from './context/SettingsContext';

function AppContent() {
  const [isReady, setIsReady] = useState(false);
  const { liteMode } = useSettings();

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Prevent scrolling while loading
    if (!isReady) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.overflow = 'unset';
    };
  }, [isReady]);

  useEffect(() => {
    if (!liteMode) {
      document.body.classList.add('custom-cursor');
    } else {
      document.body.classList.remove('custom-cursor');
    }
  }, [liteMode]);

  return (
    <div className="bg-black text-slate-50 font-sans selection:bg-indigo-500/30">
      <AnimatePresence>
        {!isReady && (
          <HyperspaceLoader key="loader" onComplete={() => setIsReady(true)} />
        )}
      </AnimatePresence>

      {!liteMode && <Starfield />}
      {!liteMode && <NebulaLayer />}
      {!liteMode && <CursorTrail />}
      <HUDBar />
      <ShipProgress />
      <GalaxyMap />

      <main className="relative z-10 w-full overflow-x-hidden">
        <LaunchSection />
        <AboutPlanet />
        <SkillsGalaxy />
        <ProjectsUniverse />
        <JourneyAsteroids />
        <ContactStation />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

