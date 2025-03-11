import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { RTCPeerConnection, mediaDevices } from 'react-native-webrtc';

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    // Optionally add TURN servers here if needed:
    // { urls: 'turn:your.turn.server:3478', username: 'user', credential: 'pass' },
  ],
};

const WebRTCClient: React.FC = () => {
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [offerSDP, setOfferSDP] = useState<any>(null);
  const [answerSDP, setAnswerSDP] = useState<any>(null);
  const [remoteOfferText, setRemoteOfferText] = useState<string>('');

  // Capture local audio stream on mount
  useEffect(() => {
    const getLocalStream = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setLocalStream(stream);
        console.log('GETTING STREAM:', stream.getAudioTracks());
        console.log('Local audio stream acquired');
      } catch (error) {
        //console.error('getUserMedia error: ', error);
        Alert.alert('Error', 'Failed to get local audio stream.');
      }
    };
    getLocalStream();
    // Cleanup on unmount
    return () => {
      localStream?.getTracks().forEach((track: any) => track.stop());
    };
  }, []);

  // Create and configure RTCPeerConnection
  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(configuration);
    if (localStream) {
      localStream.getTracks().forEach((track: any) => {
        peerConnection.addTrack(track, localStream);
      });
    }
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('New ICE candidate:', event.candidate);
      }
    };
    peerConnection.ontrack = (event) => {
      console.log('Remote track received:', event);
      if (event.streams && event.streams[0]) {
        //console.log("COMMENTS HERE", event.streams[0]);
        setRemoteStream(event.streams[0]);
      }
    };
    setPc(peerConnection);
    return peerConnection;
  };

  let sessionConstraints = {
    mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: false,
            VoiceActivityDetection: true
        }
    };

  // Caller: Create an SDP offer
  const startCall = async () => {
    const peerConnection = pc || createPeerConnection();
    try {
      const offer = await peerConnection.createOffer(sessionConstraints);
      await peerConnection.setLocalDescription(offer);
      console.log('Offer created:', offer);
      setOfferSDP(offer);
      Alert.alert('SDP Offer Generated', 'The SDP offer has been generated.');
    } catch (error) {
      console.error('Error creating offer:', error);
      Alert.alert('Error', 'Failed to create SDP offer.');
    }
  };

  // Callee: Use pasted SDP offer to create an SDP answer
  const answerCall = async () => {
    if (!pc) createPeerConnection();

    if (remoteOfferText.trim().length === 0) {
      Alert.alert('No SDP Offer', 'Please paste the SDP offer from the caller.');
      return;
    }
    try {
      const parsedOffer = JSON.parse(remoteOfferText);
      console.log('Signaling state:', pc.signalingState);
      await pc!.setRemoteDescription(parsedOffer);
      const answer = await pc!.createAnswer();
      await pc!.setLocalDescription(answer);
      console.log('Answer created:', answer);
      setAnswerSDP(answer);
      Alert.alert('SDP Answer Generated', 'The SDP answer has been generated.');
    } catch (error) {
      console.error('Error creating answer:', error);
      Alert.alert('Error', 'Failed to process the SDP offer. Please ensure it is valid JSON.');
    }
  };

  // Copy function for SDP Offer/Answer
  const copyToClipboard = (sdp: any, label: string) => {
    const sdpString = JSON.stringify(sdp, null, 2);
    Clipboard.setString(sdpString);
    Alert.alert(label, `${label} copied to clipboard.`);
  };

  // useEffect(() => {
  //   if (!pc) return;
  //   const interval = setInterval(async () => {
  //     try {
  //       const stats = await pc.getStats();
  //       stats.forEach(report => {
  //         if (report.type === 'inbound-rtp' && report.kind === 'audio') {
  //           console.log('Audio stats:', report);
  //         }
  //       });
  //     } catch (error) {
  //       console.error('Error fetching stats:', error);
  //     }
  //   }, 5000);
  
  //   // Cleanup interval when pc changes or component unmounts
  //   return () => clearInterval(interval);
  // }, [pc]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>WebRTC Audio Connection</Text>
      <Text style={styles.status}>
        {localStream ? 'Local audio is active' : 'Acquiring local audio...'}
      </Text>
      <Text style={styles.status}>
        {remoteStream ? 'Remote audio connected' : 'Waiting for remote audio...'}
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Start Call (Generate Offer)" onPress={startCall} />
      </View>

      {offerSDP && (
        <View style={styles.buttonContainer}>
          <Button
            title="Copy SDP Offer"
            onPress={() => copyToClipboard(offerSDP, 'SDP Offer')}
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Paste Remote SDP Offer:</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Paste the SDP offer here"
          placeholderTextColor="#888"
          value={remoteOfferText}
          onChangeText={setRemoteOfferText}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Answer Call (Generate Answer)" onPress={answerCall} />
      </View>

      {answerSDP && (
        <View style={styles.buttonContainer}>
          <Button
            title="Copy SDP Answer"
            onPress={() => copyToClipboard(answerSDP, 'SDP Answer')}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default WebRTCClient;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 10,
  },
  buttonContainer: {
    marginVertical: 20,
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  inputLabel: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 100,
    color: '#fff',
    fontSize: 12,
    textAlignVertical: 'top',
  },
});
