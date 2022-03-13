import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useEffect, useState} from 'react';

export type QueueItem = {
  id: number;
  albumName: string;
  noteText: string;
};

export type Queue = {
  unshuffled: QueueItem[];
  shuffled: QueueItem[];
};

const QUEUE_KEY = 'FlashNoteApp::Queue';

const QueueContext = createContext<{
  queue: Queue | null;
  setQueue: (newQueue: Queue | null) => void;
}>({
  queue: null,
  setQueue: _ => {},
});

const useQueueContext = () => useContext(QueueContext);

const QueueContextProvider = ({children}: {children: React.ReactNode}) => {
  const [queue, setQueue] = useState<Queue | null>(null);

  useEffect(() => {
    console.log('queue starting up');
    if (queue) {
      AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    }
  }, [queue]);

  useEffect(() => {
    console.log('starting up');
    AsyncStorage.getItem(QUEUE_KEY).then(value => {
      console.log(value);
      if (value) {
        setQueue(JSON.parse(value));
      }
    });
  }, []);

  return (
    <QueueContext.Provider
      value={{
        queue: queue,
        setQueue,
      }}>
      {children}
    </QueueContext.Provider>
  );
};

export {useQueueContext, QueueContextProvider};
