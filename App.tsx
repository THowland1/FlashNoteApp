/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useCallback, useRef, useState} from 'react';
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

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';

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
import {
  Queue,
  QueueContextProvider,
  QueueItem,
  useQueueContext,
} from './src/queueContext';

import Reactotron from 'reactotron-react-native';
import {PushNotificationScheduledLocalObject} from 'react-native-push-notification';

import {QueryClient, QueryClientProvider, useQuery} from 'react-query';

const queryClient = new QueryClient();

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

const MAX_SCHEDULED_NOTIFICATION_COUNT = 64;

type Option = {albumName: string; items: string[]};
const OPTIONS: Option[] = [
  {albumName: 'US State Capitals', items: STATE_CAPITALS},
  {
    albumName: 'Double Nobel Prize Winners',
    items: [
      'Marie Curie: Physics in 1903; Chemistry in 1906',
      'Linus Pauling: Chemistry in 1954; Peace in 1962',
      'John Bardeen: Physics in 1956 and 1972',
      'Frederick Sanger: Chemistry in 1958 and 1980',
    ],
  },
];

/**
 *
 * Theme
 * Darker: #0a1436
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
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [state, setState] = useState({} as any);
  const {data: scheduledNotif} = useQuery(
    'ScheduledNotifications',
    async () => {
      console.log('Getting');
      const result = await notif.getScheduledLocalNotificationsAsync();
      console.log('Got');
      console.log(result);
      return result;
    },
    {refetchInterval: 2000},
  );
  const {preferences, patchPreferences} = usePreferencesContext();
  const {queue, setQueue} = useQueueContext();
  const actionSheetRef = useRef<ActionSheet | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const backgroundStyle = {
    // backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    backgroundColor: '#151D3B',
    color: '#F5F5F5',
  };

  function onRegister(token: {token: string}) {
    setState({registerToken: token.token, fcmRegistered: true});
  }

  function onNotif(notif: any) {
    console.log(notif);
    Alert.alert(notif.title, notif.message);
  }

  function handlePerm(perms: any) {
    Alert.alert('Permissions', JSON.stringify(perms));
  }

  const notif = new NotifService(onRegister, onNotif);

  function updateQueue(albumName: string, items: string[]) {
    const unshuffled: QueueItem[] = items.map((item, i) => ({
      id: i,
      albumName,
      noteText: item,
    }));

    let shuffled = [...unshuffled];

    if (preferences.shuffle) {
      shuffleArray(shuffled);
    }

    const newQueue: Queue = {
      shuffled,
      unshuffled,
    };

    setQueue(newQueue);
    return newQueue;
  }
  async function scheduleLoadsInOneGo(albumName: string, items: string[]) {
    notif.cancelAll();

    const newQueue = updateQueue(albumName, items);

    const date = new Date();

    let playingNext = [...newQueue.shuffled];

    // One for the meta "You have reached the end" notification
    const maxCount = MAX_SCHEDULED_NOTIFICATION_COUNT - 1;

    if (preferences.repeat) {
      while (playingNext.length === 0 || playingNext.length < maxCount) {
        playingNext.push(...playingNext);
      }
    }
    playingNext = playingNext.slice(0, maxCount);

    playingNext.forEach(item => {
      date.setTime(date.getTime() + 1000 * preferences.intervalInSeconds);
      console.log(date);
      notif.scheduleNotif({
        id: item.id,
        title: item.albumName,
        date,
        message: item.noteText,
      });
    });

    date.setTime(date.getTime() + 1000 * 1);
    notif.scheduleNotif({
      id: 999,
      title: albumName,
      date,
      message: 'You have reached the end',
    });
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <View>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        <View
          style={{
            position: 'absolute',
            bottom: 50,
            left: 10,
            right: 10,
            height: 50,
            borderRadius: 6,
            backgroundColor: '#000208',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              padding: 7,
            }}>
            <View
              style={{
                backgroundColor: '#0000ff',
                width: 36,
                height: 36,
                borderRadius: 2,
              }}></View>
          </View>
          <TouchableOpacity
            style={{padding: 7, flexGrow: 1}}
            onPress={() => bottomSheetRef.current?.snapToIndex(0)}>
            <Text style={{color: '#fff6'}}>Now playing</Text>
            <Text style={{color: '#fff'}}>US State Capitals</Text>
          </TouchableOpacity>
          <View style={{padding: 7}}>
            <I.Play color={'#fff'} />
          </View>
        </View>
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            zIndex: 2,
          }}>
          <Text>Hjd</Text>
          <BottomSheet
            enablePanDownToClose
            backgroundStyle={{backgroundColor: '#000208f5'}}
            ref={bottomSheetRef}
            index={0}
            snapPoints={['50%']}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
              }}>
              <Text style={{color: '#fff'}}>Awesome 🎉</Text>
              <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
                <Text style={{color: '#fff'}}>Close</Text>
              </TouchableOpacity>
              <BottomSheetScrollView>
                {scheduledNotif &&
                  scheduledNotif.map((item, i) => (
                    <View key={i}>
                      <Text style={{color: '#fff'}}>{item.message}</Text>
                      <Text key={i} style={{color: '#fff6'}}>
                        {item.title}
                      </Text>
                    </View>
                  ))}
              </BottomSheetScrollView>
              <View style={styles.flexRow}>
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
                    'Every 5 seconds',
                    'Every 10 seconds',
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
                        5,
                        10,
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
            </View>
          </BottomSheet>
        </View>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <Header />
          <View style={styles.container}>
            <View style={styles.spacer} />
            <TextInput
              style={styles.textField}
              value={state.registerToken}
              placeholder="Register token"
            />
            <View style={styles.spacer} />

            {OPTIONS.map(({albumName, items}, i) => (
              <Section title={albumName} key={i}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={async () => {
                    await scheduleLoadsInOneGo(albumName, items);
                  }}>
                  <Text style={styles.buttonText}>Play</Text>
                </TouchableOpacity>
              </Section>
            ))}

            {queue && (
              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={[backgroundStyle, {height: 200}]}>
                {queue.shuffled.map((item, i) => (
                  <View key={i}>
                    <Text style={{color: '#fff'}}>{item.noteText}</Text>
                    <Text key={i} style={{color: '#fff6'}}>
                      {item.albumName}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            )}

            {scheduledNotif?.length ? (
              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={[backgroundStyle, {height: 200}]}>
                {scheduledNotif.map((item, i) => (
                  <View key={i}>
                    <Text style={{color: '#fff'}}>{item.message}</Text>
                    <Text key={i} style={{color: '#fff6'}}>
                      {item.title}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text>None expected</Text>
            )}

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
              <Text style={styles.buttonText}>
                Schedule Notification in 30s
              </Text>
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
                  Reactotron.display({name: 'LOG', value: {notifs}}),
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
            <Section title="Step One">
              <Text>
                Edit <Text style={styles.highlight}>App.tsx</Text> to change
                this screen and then come back to see your edits.
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
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
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default () => (
  <GestureHandlerRootView>
    <QueryClientProvider client={queryClient}>
      <QueueContextProvider>
        <PreferencesContextProvider>
          <App />
        </PreferencesContextProvider>
      </QueueContextProvider>
    </QueryClientProvider>
  </GestureHandlerRootView>
);

function shuffleArray<T extends any[]>(array: T) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
