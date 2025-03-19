import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AudioRecord from 'react-native-audio-record';
import Sound from 'react-native-sound';

const AudioTestPage: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [sound, setSound] = useState<Sound | null>(null);

  useEffect(() => {
    // Initialize AudioRecord with your desired options.
    const options = {
      sampleRate: 16000,  // default is 44100 but lower sample rate saves space
      channels: 1,        // 1 or 2, default is 1
      bitsPerSample: 16,  // 8 or 16, default is 16
      audioSource: 6,     // android only (VOICE_COMMUNICATION)
      wavFile: 'test.wav',// name of the output file
    };
    AudioRecord.init(options);
  }, []);

  const startRecording = async () => {
    setRecording(true);
    setAudioFile(null);
    AudioRecord.start();
    Alert.alert('Recording Started', 'Speak into the microphone...');
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      const filePath = await AudioRecord.stop();
      setRecording(false);
      setAudioFile(filePath);
      Alert.alert('Recording Stopped', `Audio file saved at:\n${filePath}`);
    } catch (error) {
      console.error('Stop recording error:', error);
      Alert.alert('Error', 'Failed to stop recording properly.');
    }
  };

  const playAudio = () => {
    if (!audioFile) {
      Alert.alert('No Recording', 'Please record audio first.');
      return;
    }
    // Release any previous sound instance
    if (sound) {
      sound.release();
    }
    const newSound = new Sound(audioFile, '', (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        Alert.alert('Error', 'Failed to load the sound');
        return;
      }
      newSound.play((success) => {
        if (success) {
          console.log('Sound played successfully');
        } else {
          console.log('Playback failed due to audio decoding errors');
          Alert.alert('Error', 'Playback failed.');
        }
      });
    });
    setSound(newSound);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Test Local Audio</Text>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <View style={styles.spacer} />
      <Button title="Play Recording" onPress={playAudio} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  spacer: {
    height: 20,
  },
});

export default AudioTestPage;
