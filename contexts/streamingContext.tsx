import React, { createContext, useContext, useState } from 'react';

interface StreamingContextType {
  isStreaming: boolean;
  setIsStreaming: (value: boolean) => void;
}

const StreamingContext = createContext<StreamingContextType | undefined>(undefined);

export function StreamingProvider({ children }: { children: React.ReactNode }) {
  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <StreamingContext.Provider value={{ isStreaming, setIsStreaming }}>
      {children}
    </StreamingContext.Provider>
  );
}

export function useStreaming() {
  const context = useContext(StreamingContext);
  if (context === undefined) {
    throw new Error('useStreaming must be used within a StreamingProvider');
  }
  return context;
}