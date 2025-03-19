import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import {
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
  ClientRoleType,
} from 'react-native-agora';

const APP_ID = 'df5b450ad22a4fbab354029fd9a6791b';
// Define your channel name and token (use null if not using a token)
const CHANNEL_NAME = 'test';
const TOKEN = '007eJxTYGC+67rJXutuvt0idc4mk7zU9d4CGqEt+TPy//c/0n/tLK3AkJJmmmRiapCYYmSUaJKWlJhkbGpiYGSZlmKZaGZuaZi03/JyekMgI4Nnw1VGRgYIBPFZGEpSi0sYGAC2IR4j';


const Agora = () => {
  const engine = useRef<IRtcEngine | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<number[]>([]);
  const [localVolume, setLocalVolume] = useState<number>(0);

  // Request microphone permission on Android; iOS permissions are managed by the system.
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'We need access to your microphone for audio calls.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission denied');
        } else {
          console.log('Microphone permission granted');
        }
      } catch (error) {
        console.error('Permission error:', error);
      }
    } else {
      console.log(
        'iOS permissions are managed by the system. Ensure NSMicrophoneUsageDescription is set in app.json.'
      );
    }
  };

  // Initialize the Agora engine for audio-only streaming and enable volume indication.
  const initAgora = async () => {
    if (!APP_ID) {
      console.error('Please provide a valid Agora App ID');
      return;
    }

    engine.current = createAgoraRtcEngine();
    engine.current.initialize({ appId: APP_ID });

    engine.current.setChannelProfile(ChannelProfileType.ChannelProfileLiveBroadcasting);
    engine.current.setClientRole(ClientRoleType.ClientRoleBroadcaster);
    engine.current.enableAudio();

    // Enable audio volume indication (interval 200ms, smooth factor 3, report local voice activity)
    engine.current.enableAudioVolumeIndication(200, 3, true);

    // Listen for join channel success
    engine.current.addListener('onJoinChannelSuccess', (connection, elapsed) => {
      console.log('Joined channel:', connection.channelId);
      setIsJoined(true);
    });

    // Listen for remote user joining
    engine.current.addListener('onUserJoined', (connection, uid, elapsed) => {
      console.log('Remote user joined:', uid);
      setRemoteUsers(prev => [...prev, uid]);
    });

    // Listen for remote user leaving
    engine.current.addListener('onUserOffline', (connection, uid, reason) => {
      console.log('Remote user left:', uid);
      setRemoteUsers(prev => prev.filter(user => user !== uid));
    });

    // Listen for audio volume indication events
    engine.current.addListener('onAudioVolumeIndication', (speakers, totalVolume) => {
      console.log('Audio volume indication:', speakers, 'Total volume:', totalVolume);
      if (Array.isArray(speakers)) {
        const localSpeaker = speakers.find(speaker => speaker.uid === 0);
        if (localSpeaker) {
          setLocalVolume(localSpeaker.volume);
        } else {
          setLocalVolume(totalVolume);
        }
      } else {
        console.warn('Audio volume indication: speakers is not an array:', speakers);
      }
    });
  };

  // Function to join the channel
  const joinChannel = async () => {
    await requestPermissions();
    if (!engine.current) {
      await initAgora();
    }
    engine.current?.joinChannel(TOKEN, CHANNEL_NAME, 0, {});
  };

  // Function to leave the channel
  const leaveChannel = async () => {
    if (engine.current) {
      engine.current.leaveChannel();
      setIsJoined(false);
      setRemoteUsers([]);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (engine.current) {
        engine.current.leaveChannel();
        engine.current.release();
        engine.current = null;
      }
    };
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Agora Audio Streaming</Text>
      {isJoined ? (
        <Text style={{ marginBottom: 20 }}>Connected to channel: {CHANNEL_NAME}</Text>
      ) : (
        <Text style={{ marginBottom: 20 }}>Not in a channel</Text>
      )}
      <Text style={{ marginBottom: 20 }}>Local audio volume: {localVolume}</Text>
      <TouchableOpacity
        onPress={joinChannel}
        style={{ padding: 10, backgroundColor: '#4CAF50', marginBottom: 10 }}
      >
        <Text style={{ color: 'white' }}>Join Call</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={leaveChannel}
        style={{ padding: 10, backgroundColor: '#F44336' }}
      >
        <Text style={{ color: 'white' }}>Leave Call</Text>
      </TouchableOpacity>
      {remoteUsers.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text>Remote Users:</Text>
          {remoteUsers.map(uid => (
            <Text key={uid}>User {uid}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default Agora;
