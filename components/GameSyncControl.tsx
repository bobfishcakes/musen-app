import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { ThemedText } from './ThemedText';

interface GameSyncControlProps {
  initialMinutes?: number;
}

export const GameSyncControl = ({ initialMinutes = 10 }: GameSyncControlProps) => {
  const [currentTime, setCurrentTime] = useState(initialMinutes * 60 + 54);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tempTime, setTempTime] = useState(currentTime);

  const adjustSeconds = (amount: number) => {
    setTempTime(prev => Math.max(0, prev + amount));
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setCurrentTime(tempTime);
    setShowConfirm(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(prev => Math.max(0, prev - 1));
      setTempTime(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const displayTime = `${Math.floor(tempTime / 60).toString().padStart(2, '0')}:${(tempTime % 60).toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <ThemedText type="title" style={styles.countdown}>
          {displayTime}
        </ThemedText>
      </View>

      <ThemedText style={styles.notYourTimeText}>Not your game time?</ThemedText>
      
      <View style={styles.adjustButtons}>
        <Pressable onPress={() => adjustSeconds(-10)} style={styles.negativeTimeButton}>
          <ThemedText style={styles.buttonText}>-10s</ThemedText>
        </Pressable>
        <Pressable onPress={() => adjustSeconds(-5)} style={styles.negativeTimeButton}>
          <ThemedText style={styles.buttonText}>-5s</ThemedText>
        </Pressable>
        <Pressable onPress={() => adjustSeconds(-1)} style={styles.negativeTimeButton}>
          <ThemedText style={styles.buttonText}>-1s</ThemedText>
        </Pressable>
        <Pressable onPress={() => adjustSeconds(1)} style={styles.positiveTimeButton}>
          <ThemedText style={styles.buttonText}>+1s</ThemedText>
        </Pressable>
        <Pressable onPress={() => adjustSeconds(5)} style={styles.positiveTimeButton}>
          <ThemedText style={styles.buttonText}>+5s</ThemedText>
        </Pressable>
        <Pressable onPress={() => adjustSeconds(10)} style={styles.positiveTimeButton}>
          <ThemedText style={styles.buttonText}>+10s</ThemedText>
        </Pressable>
      </View>

      {showConfirm && (
        <Pressable onPress={handleConfirm} style={styles.confirmButton}>
          <ThemedText style={styles.confirmButtonText} type="defaultSemiBold">Confirm</ThemedText>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(232, 232, 232, 0.03)',
    padding: 20,
    alignItems: 'center',
    width: Platform.OS === 'web' ? '100%' : '100%',
    maxWidth: Platform.OS === 'web' ? 850 : undefined, // Match content wrapper width
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: .5,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
  },
  timerContainer: {
    backgroundColor: 'rgba(232, 232, 232, 0.0)',
    padding: 2,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 3,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    minWidth: 200,
  },
  countdown: {
    fontSize: 64,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 74,
  },
  notYourTimeText: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  adjustButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  negativeTimeButton: {
    backgroundColor: '#FF8B8B',
    width: 45,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positiveTimeButton: {
    backgroundColor: '#486B52',
    width: 45,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: 'rgba(233, 233, 233, 0.99)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});