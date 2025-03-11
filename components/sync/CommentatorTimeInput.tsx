import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { syncController } from '../../api/sync/syncController';

interface Props {
  gameId: string;
  onTimeUpdate: (minutes: number, seconds: number) => void;
}

export const CommentatorTimeInput: React.FC<Props> = ({ gameId, onTimeUpdate }) => {
  const [minutes, setMinutes] = useState('12');
  const [seconds, setSeconds] = useState('00');

  const handleUpdate = () => {
    const mins = parseInt(minutes);
    const secs = parseInt(seconds);
    if (!isNaN(mins) && !isNaN(secs)) {
      onTimeUpdate(mins, secs);
      syncController.updateClock(gameId, { minutes: mins, seconds: secs });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={minutes}
        onChangeText={setMinutes}
        keyboardType="numeric"
        maxLength={2}
      />
      <TextInput
        style={styles.input}
        value={seconds}
        onChangeText={setSeconds}
        keyboardType="numeric"
        maxLength={2}
      />
      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    width: 50,
    height: 40,
    borderWidth: 1,
    marginHorizontal: 5,
    textAlign: 'center',
  },
});