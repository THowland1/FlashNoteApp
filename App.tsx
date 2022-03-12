/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useRef, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import NotifService from './src/NotifService';
import {
  PreferencesContextProvider,
  usePreferencesContext,
} from './src/preferencesContext';
import {STATE_CAPITALS} from './src/state-capitals';

import * as I from 'react-native-feather';

/**
 *
 * Theme
 * Dark: #151D3B
 * Bold red: #D82148
 * Pale green action: #6EBF8B
 * Sandy: #DADBBD
 */

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      {children}
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [state, setState] = useState({} as any);
  const [remaining, setRemaining] = useState(0);
  const {preferences, patchPreferences} = usePreferencesContext();
  const actionSheetRef = useRef<ActionSheet | null>(null);

  const backgroundStyle = {
    // backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    backgroundColor: '#151D3B',
    color: '#F5F5F5',
  };

  function onRegister(token: {token: string}) {
    setState({registerToken: token.token, fcmRegistered: true});
  }

  function onNotif(notif: any) {
    Alert.alert(notif.title, notif.message);
  }

  function handlePerm(perms: any) {
    Alert.alert('Permissions', JSON.stringify(perms));
  }

  const notif = new NotifService(onRegister, onNotif);

  async function scheduleLoadsInOneGo() {
    const date = new Date();

    STATE_CAPITALS.forEach(item => {
      date.setTime(date.getTime() + 1000 * 10);

      notif.scheduleNotif({title: 'State capitals', date, message: item});
    });
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View style={styles.container}>
          <View>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={async () => {
                patchPreferences({
                  shuffle: !preferences.shuffle,
                });
              }}>
              <I.Shuffle
                color={preferences.shuffle ? '#6EBF8B' : '#ffffff'}
                strokeWidth={preferences.shuffle ? 3 : 2}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={async () => {
                actionSheetRef.current?.show();
              }}>
              <Text style={styles.iconButtonText}>
                {' '}
                /{preferences.intervalInSeconds}
              </Text>
            </TouchableOpacity>
            <ActionSheet
              ref={actionSheetRef}
              title={'Which often do you want to see a new notification?'}
              options={[
                'Cancel',
                'Every 30 seconds',
                'Every minute',
                'Every 5 minutes',
                'Every 10 minutes',
                'Every 30 minutes',
                'Every hour',
              ]}
              cancelButtonIndex={0}
              onPress={index => {
                patchPreferences({
                  intervalInSeconds: [
                    30,
                    30,
                    60,
                    5 * 60,
                    10 * 60,
                    30 * 60,
                    60 * 60,
                  ][index],
                });
              }}
            />
            <TouchableOpacity
              style={styles.iconButton}
              onPress={async () => {
                patchPreferences({
                  repeat: !preferences.repeat,
                });
              }}>
              <I.Repeat
                color={preferences.repeat ? '#6EBF8B' : '#ffffff'}
                strokeWidth={preferences.repeat ? 3 : 2}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.spacer} />
          <TextInput
            style={styles.textField}
            value={state.registerToken}
            placeholder="Register token"
          />
          <View style={styles.spacer} />

          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              patchPreferences({
                intervalInSeconds: 300 * Math.random(),
                repeat: Math.random() < 0.5,
                shuffle: Math.random() < 0.5,
              });
            }}>
            <Text style={styles.buttonText}>Change preference</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await scheduleLoadsInOneGo();
            }}>
            <Text style={styles.buttonText}>Loads in one go</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.localNotif();
            }}>
            <Text style={styles.buttonText}>Local Notification (now)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.localNotif('sample.mp3');
            }}>
            <Text style={styles.buttonText}>
              Local Notification with sound (now)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.scheduleNotif();
            }}>
            <Text style={styles.buttonText}>Schedule Notification in 30s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.scheduleNotif({});
            }}>
            <Text style={styles.buttonText}>
              Schedule Notification with sound in 30s
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.cancelNotif();
            }}>
            <Text style={styles.buttonText}>
              Cancel last notification (if any)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.cancelAll();
            }}>
            <Text style={styles.buttonText}>Cancel all notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.checkPermission(handlePerm);
            }}>
            <Text style={styles.buttonText}>Check Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.requestPermissions();
            }}>
            <Text style={styles.buttonText}>Request Permissions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.abandonPermissions();
            }}>
            <Text style={styles.buttonText}>Abandon Permissions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.getScheduledLocalNotifications(notifs =>
                console.log(notifs),
              );
            }}>
            <Text style={styles.buttonText}>
              Console.Log Scheduled Local Notifications
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.getDeliveredNotifications(notifs => console.log(notifs));
            }}>
            <Text style={styles.buttonText}>
              Console.Log Delivered Notifications
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.createOrUpdateChannel();
            }}>
            <Text style={styles.buttonText}>Create or update a channel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.popInitialNotification();
            }}>
            <Text style={styles.buttonText}>popInitialNotification</Text>
          </TouchableOpacity>

          <View style={styles.spacer} />

          {state.fcmRegistered && (
            <Text style={styles.buttonText}>FCM Configured !</Text>
          )}

          <View style={styles.spacer} />
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="State capitals">
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                await scheduleLoadsInOneGo();
              }}>
              <Text style={styles.buttonText}>Loads in one go</Text>
            </TouchableOpacity>
            <Text style={styles.buttonText}>Loads in one go {remaining}</Text>
          </Section>
          <Section title="Step One">
            <Text>
              Edit <Text style={styles.highlight}>App.tsx</Text> to change this
              screen and then come back to see your edits.
            </Text>
          </Section>
          <Section title="See Your Changes">
            <Text>
              <ReloadInstructions />
            </Text>
          </Section>
          <Section title="Debug">
            <Text>
              <DebugInstructions />
            </Text>
          </Section>
          <Section title="Learn More">
            <Text>Read the docs to discover what to do next:</Text>
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  iconButton: {
    margin: 5,
    padding: 10,
  },
  iconButtonText: {
    margin: 5,
    padding: 10,
    color: '#fff',
    fontWeight: '700',
  },
  button: {
    margin: 5,
    padding: 10,
    width: '70%',
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 18,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151D3B',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  textField: {
    borderWidth: 1,
    borderColor: '#AAAAAA',
    margin: 5,
    padding: 5,
    width: '70%',
  },
  spacer: {
    height: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    color: '#F5F5F5',
  },
});

export default () => (
  <PreferencesContextProvider>
    <App />
  </PreferencesContextProvider>
);
