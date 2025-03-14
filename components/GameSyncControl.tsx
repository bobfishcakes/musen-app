import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Pressable, TextInput } from 'react-native';
import { ThemedText } from './ThemedText';

interface GameSyncControlProps {
  initialMinutes?: number;
}

export const GameSyncControl = ({ initialMinutes = 10 }: GameSyncControlProps) => {
  const [minutes, setMinutes] = useState(initialMinutes.toString());
  const [seconds, setSeconds] = useState('54');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialMinutes * 60 + 54);

  const handleMinutesInput = (text: string) => {
    const numbers = text.replace(/[^0-9]/g, '');
    const parsed = parseInt(numbers);
    if (parsed > 99) return;
    setMinutes(numbers);
  };

  const handleSecondsInput = (text: string) => {
    const numbers = text.replace(/[^0-9]/g, '');
    const parsed = parseInt(numbers || '0');
    if (parsed > 59) return;
    setSeconds(numbers);
  };

  const adjustMinutes = (amount: number) => {
    const newMinutes = Math.max(0, Math.min(99, parseInt(minutes || '0') + amount));
    setMinutes(newMinutes.toString());
  };

  const adjustSeconds = (amount: number) => {
    const currentSecs = parseInt(seconds || '0');
    const newSeconds = Math.max(0, Math.min(59, currentSecs + amount));
    setSeconds(newSeconds.toString().padStart(2, '0'));
  };

  const confirmTime = () => {
    const totalSeconds = (parseInt(minutes || '0') * 60) + parseInt(seconds || '0');
    setCurrentTime(totalSeconds);
    setIsEditing(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const displayTime = `${Math.floor(currentTime / 60).toString().padStart(2, '0')}:${(currentTime % 60).toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.countdown}>
        {displayTime}
      </ThemedText>

      {isEditing ? (
        <>
          <View style={styles.inputContainer}>
            <View style={styles.timeInputGroup}>
              <TextInput
                style={styles.timeInput}
                value={minutes}
                onChangeText={handleMinutesInput}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="10"
                placeholderTextColor="#999"
              />
              <ThemedText style={styles.timeLabel}>min</ThemedText>
            </View>

            <ThemedText style={styles.timeSeparator}>:</ThemedText>

            <View style={styles.timeInputGroup}>
              <TextInput
                style={styles.timeInput}
                value={seconds}
                onChangeText={handleSecondsInput}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="00"
                placeholderTextColor="#999"
              />
              <ThemedText style={styles.timeLabel}>sec</ThemedText>
            </View>
          </View>

          <View style={styles.adjustButtons}>
            <Pressable onPress={() => adjustSeconds(-5)} style={styles.timeButton}>
              <ThemedText style={styles.buttonText}>-5</ThemedText>
            </Pressable>
            <Pressable onPress={() => adjustSeconds(-1)} style={styles.timeButton}>
              <ThemedText style={styles.buttonText}>-1</ThemedText>
            </Pressable>
            <Pressable onPress={() => adjustSeconds(1)} style={styles.timeButton}>
              <ThemedText style={styles.buttonText}>+1</ThemedText>
            </Pressable>
            <Pressable onPress={() => adjustSeconds(5)} style={styles.timeButton}>
              <ThemedText style={styles.buttonText}>+5</ThemedText>
            </Pressable>
          </View>

          <Pressable onPress={confirmTime} style={styles.startButton}>
            <ThemedText style={styles.startButtonText}>Confirm Time</ThemedText>
          </Pressable>
        </>
      ) : (
        <Pressable onPress={() => setIsEditing(true)} style={styles.editButton}>
          <ThemedText style={styles.startButtonText}>Edit Time</ThemedText>
        </Pressable>
      )}

      <ThemedText style={styles.liveText}>LIVE</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  countdown: {
    fontSize: 64,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  timeInputGroup: {
    alignItems: 'center',
  },
  timeInput: {
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#486B52',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: 70,
    textAlign: 'center',
    color: '#000000',
  },
  timeSeparator: {
    fontSize: 24,
    color: '#486B52',
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  timeLabel: {
    fontSize: 14,
    color: '#486B52',
    marginTop: 4,
  },
  adjustButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  timeButton: {
    backgroundColor: '#E8F0EA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#486B52',
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#486B52',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  liveText: {
    color: '#486B52',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#486B52',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 20,
  },
});

export default GameSyncControl;