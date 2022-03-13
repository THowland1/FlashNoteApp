import React, {createContext, useContext, useState} from 'react';
import {Alert} from 'react-native';
import {PushNotificationScheduledLocalObject} from 'react-native-push-notification';
import {useQuery} from 'react-query';
import NotifService from './NotifService';

type Notifications = {
  scheduled: PushNotificationScheduledLocalObject[];
  service: NotifService;
};

const DEFAULT_NOTIFICATIONS: Notifications = {
  scheduled: [],
  service: {} as any,
};

const NotificationsContext = createContext<Notifications>(
  DEFAULT_NOTIFICATIONS,
);

const useNotificationsContext = () => useContext(NotificationsContext);

const NotificationsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [, setState] = useState<{
    registerToken: string;
    fcmRegistered: boolean;
  } | null>(null);

  function onRegister(token: {token: string}) {
    setState({registerToken: token.token, fcmRegistered: true});
  }

  function onNotif(notif: any) {
    console.log(notif);
    Alert.alert(notif.title, notif.message);
  }

  const notif = new NotifService(onRegister, onNotif);

  const {data: scheduledNotif} = useQuery(
    'ScheduledNotifications',
    async () => {
      const result = await notif.getScheduledLocalNotificationsAsync();
      return result;
    },
    {refetchInterval: 2000},
  );

  return (
    <NotificationsContext.Provider
      value={{
        scheduled: scheduledNotif || [],
        service: notif,
      }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export {useNotificationsContext, NotificationsContextProvider};
