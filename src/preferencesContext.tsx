import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useEffect, useState} from 'react';

type Preferences = {
  intervalInSeconds: number;
  shuffle: boolean;
  repeat: boolean;
  paused: boolean;
};

const DEFAULT_PREFERENCES: Preferences = {
  intervalInSeconds: 60 * 5,
  shuffle: false,
  repeat: true,
  paused: false,
};

const PREFERENCES_KEY = 'FlashNoteApp::Preferences';

const PreferencesContext = createContext<{
  preferences: Preferences;
  setPreferences: (newPreferences: Preferences) => void;
  patchPreferences: (newPreferences: Partial<Preferences>) => void;
}>({
  preferences: DEFAULT_PREFERENCES,
  setPreferences: _ => {},
  patchPreferences: _ => {},
});

const usePreferencesContext = () => useContext(PreferencesContext);

const PreferencesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  useEffect(() => {
    console.log('preferences starting up');
    if (preferences) {
      AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    }
  }, [preferences]);

  useEffect(() => {
    console.log('starting up');
    AsyncStorage.getItem(PREFERENCES_KEY).then(value => {
      console.log(value);
      if (value) {
        setPreferences(JSON.parse(value));
      }
    });
  }, []);

  function patchPreferences(newPreferences: Partial<Preferences>) {
    setPreferences({
      ...(preferences || DEFAULT_PREFERENCES),
      ...newPreferences,
    });
  }

  return (
    <PreferencesContext.Provider
      value={{
        preferences: preferences || DEFAULT_PREFERENCES,
        setPreferences,
        patchPreferences,
      }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export {usePreferencesContext, PreferencesContextProvider};
