import { createContext, useContext, useState, ReactNode } from 'react';
import { playHoverSound, playBlipSound } from '../utils/audio';

interface SettingsContextType {
  liteMode: boolean;
  setLiteMode: (v: boolean) => void;
  audioEnabled: boolean;
  setAudioEnabled: (v: boolean) => void;
  playHover: () => void;
  playBlip: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [liteMode, setLiteMode] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const playHover = () => { if (audioEnabled) playHoverSound(); };
  const playBlip = () => { if (audioEnabled) playBlipSound(); };

  return (
    <SettingsContext.Provider value={{
      liteMode, setLiteMode,
      audioEnabled, setAudioEnabled,
      playHover, playBlip
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
