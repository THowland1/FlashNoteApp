import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useEffect, useState} from 'react';

type Preferences = {
  intervalInSeconds: number;
  shuffle: boolean;
  repeat: boolean;
};

const DEFAULT_PREFERENCES: Preferences = {
  intervalInSeconds: 60 * 5,
  shuffle: false,
  repeat: true,
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
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  useEffect(() => {
    AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    AsyncStorage.getItem(PREFERENCES_KEY).then(value => {
      if (value) {
        setPreferences(JSON.parse(value));
      }
    });
  }, []);

  function patchPreferences(newPreferences: Partial<Preferences>) {
    setPreferences({
      ...preferences,
      ...newPreferences,
    });
  }

  return (
    <PreferencesContext.Provider
      value={{preferences, setPreferences, patchPreferences}}>
      {children}
    </PreferencesContext.Provider>
  );
};

export {usePreferencesContext, PreferencesContextProvider};
