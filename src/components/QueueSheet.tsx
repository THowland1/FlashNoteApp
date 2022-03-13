import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useMemo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useNotificationsContext} from '../notificationsContext';
import {useQueueContext} from '../queueContext';

// {

// }

type PlayingSheetProps = {
  innerRef: React.MutableRefObject<BottomSheet | null>;
};
function PlayingSheet({innerRef}: PlayingSheetProps) {
  const {scheduled: scheduledNotifications} = useNotificationsContext();
  const {queue} = useQueueContext();

  const comingUp = useMemo(() => {
    const nextId = scheduledNotifications[0]?.id;
    if (!nextId || !queue) {
      return [];
    }
    const startIndex = queue.shuffled.findIndex(
      i => String(i.id) === String(nextId),
    );
    if (startIndex < 0) {
      return [];
    }

    return queue.shuffled.slice(startIndex);
  }, [scheduledNotifications, queue]);

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
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        zIndex: 3,
      }}>
      <BottomSheet
        style={{zIndex: 3}}
        backdropComponent={renderBackdrop}
        backgroundStyle={{backgroundColor: '#000208dd'}}
        animateOnMount={true}
        ref={innerRef}
        index={0}
        enablePanDownToClose={true}
        snapPoints={['75%']}>
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
              }}>
              Coming up ▶️
            </Text>
            <TouchableOpacity onPress={() => innerRef.current?.close()}>
              <Text style={{color: '#fff'}}>Close</Text>
            </TouchableOpacity>
          </View>
          <BottomSheetScrollView>
            {comingUp?.length ? (
              comingUp.map((item, i) => (
                <View style={{padding: 8}} key={i}>
                  <Text style={{color: '#fff'}}>{item.noteText}</Text>
                  <Text key={i} style={{color: '#fff6'}}>
                    {item.albumName}
                  </Text>
                </View>
              ))
            ) : (
              <View style={{marginTop: 40}}>
                <Text style={{color: '#fff', fontSize: 16}}>
                  No notifications scheduled!
                </Text>
              </View>
            )}
          </BottomSheetScrollView>
        </View>
      </BottomSheet>
    </View>
  );
}

export default PlayingSheet;
