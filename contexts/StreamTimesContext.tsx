import React, { createContext, useContext, useState } from 'react';

type StreamTimesContextType = {
  setStreamTime: (streamId: string, time: string) => void;
  hasTimeSet: (streamId: string) => boolean;
};

const StreamTimesContext = createContext<StreamTimesContextType | null>(null);

export const StreamTimesProvider = ({ children }: { children: React.ReactNode }) => {
  const [streamTimes, setStreamTimes] = useState<Record<string, string>>({});

  const setStreamTime = (streamId: string, time: string) => {
    setStreamTimes(prev => ({
      ...prev,
      [streamId]: time
    }));
  };

  const hasTimeSet = (streamId: string) => {
    return !!streamTimes[streamId];
  };

  return (
    <StreamTimesContext.Provider value={{ setStreamTime, hasTimeSet }}>
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