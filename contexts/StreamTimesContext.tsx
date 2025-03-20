import React, { createContext, useContext, useState } from 'react';

type StreamState = {
  time: string;
  isTimeSet: boolean;  // Explicitly track if time was set by user
};

type StreamTimesContextType = {
  setStreamTime: (streamId: string, time: string) => void;
  hasTimeSet: (streamId: string) => boolean;
  getStreamTime: (streamId: string) => string;
};

const StreamTimesContext = createContext<StreamTimesContextType | null>(null);

export const StreamTimesProvider = ({ children }: { children: React.ReactNode }) => {
  const [streamStates, setStreamStates] = useState<Record<string, StreamState>>({});

  const setStreamTime = (streamId: string, time: string) => {
    setStreamStates(prev => ({
      ...prev,
      [streamId]: {
        time,
        isTimeSet: true
      }
    }));
  };

  const hasTimeSet = (streamId: string) => {
    return streamStates[streamId]?.isTimeSet || false;
  };

  const getStreamTime = (streamId: string) => {
    return streamStates[streamId]?.time || '00:00';
  };

  return (
    <StreamTimesContext.Provider value={{ 
      setStreamTime, 
      hasTimeSet,
      getStreamTime 
    }}>
      {children}
    </StreamTimesContext.Provider>
  );
};

export const useStreamTimes = () => {
  const context = useContext(StreamTimesContext);
  if (!context) {
    throw new Error('useStreamTimes must be used within a StreamTimesProvider');
  }
  return context;
};