/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
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

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import NotifService from './src/NotifService';

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
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [state, setState] = useState({} as any);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
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

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View style={styles.container}>
          <Text style={styles.title}>
            Example app react-native-push-notification
          </Text>
          <View style={styles.spacer} />
          <TextInput
            style={styles.textField}
            value={state.registerToken}
            placeholder="Register token"
          />
          <View style={styles.spacer} />

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.localNotif();
            }}>
            <Text>Local Notification (now)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.localNotif('sample.mp3');
            }}>
            <Text>Local Notification with sound (now)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.scheduleNotif();
            }}>
            <Text>Schedule Notification in 30s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.scheduleNotif('sample.mp3');
            }}>
            <Text>Schedule Notification with sound in 30s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.cancelNotif();
            }}>
            <Text>Cancel last notification (if any)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.cancelAll();
            }}>
            <Text>Cancel all notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.checkPermission(handlePerm);
            }}>
            <Text>Check Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.requestPermissions();
            }}>
            <Text>Request Permissions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.abandonPermissions();
            }}>
            <Text>Abandon Permissions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.getScheduledLocalNotifications(notifs =>
                console.log(notifs),
              );
            }}>
            <Text>Console.Log Scheduled Local Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.getDeliveredNotifications(notifs => console.log(notifs));
            }}>
            <Text>Console.Log Delivered Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.createOrUpdateChannel();
            }}>
            <Text>Create or update a channel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              notif.popInitialNotification();
            }}>
            <Text>popInitialNotification</Text>
          </TouchableOpacity>

          <View style={styles.spacer} />

          {state.fcmRegistered && <Text>FCM Configured !</Text>}

          <View style={styles.spacer} />
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step Zero">
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Alert.alert('Yee haw', 'I have connected');
              }}>
              <Text>Click me</Text>
            </TouchableOpacity>
          </Section>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
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
  button: {
    borderWidth: 1,
    borderColor: '#000000',
    margin: 5,
    padding: 5,
    width: '70%',
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
  },
});

export default App;
