import React, {useCallback, useRef} from 'react';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {usePreferencesContext} from '../preferencesContext';
import ActionSheet from 'react-native-actionsheet';

import * as I from 'react-native-feather';
import QueueSheet from './QueueSheet';

type PlayingSheetProps = {
  innerRef: React.MutableRefObject<BottomSheet | null>;
};
function PlayingSheet({innerRef}: PlayingSheetProps) {
  const {preferences, patchPreferences} = usePreferencesContext();

  const actionSheetRef = useRef<ActionSheet | null>(null);
  const queueSheetRef = useRef<BottomSheet | null>(null);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <>
      <QueueSheet innerRef={queueSheetRef} />
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
        <BottomSheet
          backdropComponent={renderBackdrop}
          backgroundStyle={{backgroundColor: '#000208dd'}}
          animateOnMount={true}
          ref={innerRef}
          index={0}
          enablePanDownToClose={true}
          snapPoints={['90%']}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: 24,
                paddingRight: 16,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 'bold',
                  flex: 1,
                }}></Text>
              <TouchableOpacity onPress={() => innerRef.current?.close()}>
                <Text style={{color: '#fff'}}>Close</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}></View>
            <View
              style={[
                styles.flexRow,
                {
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingHorizontal: 16,
                },
              ]}></View>
            <View
              style={[
                styles.flexRow,
                {
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingHorizontal: 16,
                },
              ]}>
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
                  patchPreferences({
                    paused: !preferences.paused,
                  });
                }}>
                <I.SkipBack color={'#ffffff'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  {backgroundColor: '#6EBF8B', borderRadius: 500, padding: 16},
                ]}
                onPress={async () => {
                  patchPreferences({
                    paused: !preferences.paused,
                  });
                }}>
                {preferences.paused ? (
                  <I.Pause color={'#ffffff'} />
                ) : (
                  <I.Play
                    color={'#ffffff'}
                    style={{marginLeft: 1.5, marginRight: -1.5}}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={async () => {
                  patchPreferences({
                    paused: !preferences.paused,
                  });
                }}>
                <I.SkipForward color={'#ffffff'} />
              </TouchableOpacity>

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
            <View
              style={[
                styles.flexRow,
                {
                  marginBottom: 60,
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingHorizontal: 16,
                },
              ]}>
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
                onPress={async () => {
                  actionSheetRef.current?.show();
                }}>
                <Text style={styles.iconButtonText}>
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
                  queueSheetRef.current?.snapToIndex(0);
                }}>
                <I.List color={'#ffffff'} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheet>
      </View>
    </>
  );
}

export default PlayingSheet;

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
