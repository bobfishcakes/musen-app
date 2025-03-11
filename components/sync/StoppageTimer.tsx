// StoppageTimer.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StoppageTimerProps {
  startTime: Date;
  onEnd?: () => void;
}

export const StoppageTimer: React.FC<StoppageTimerProps> = ({
  startTime,
  onEnd
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsed(elapsedSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>Stoppage Time: {formatTime(elapsed)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center'
  },
  timer: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});