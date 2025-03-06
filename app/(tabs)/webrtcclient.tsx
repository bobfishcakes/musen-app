import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { RTCPeerConnection, mediaDevices } from 'react-native-webrtc';

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    // Optionally add TURN servers if needed:
    // { urls: 'turn:your.turn.server:3478', username: 'user', credential: 'pass' },
  ],
};

const WebRTCClient: React.FC = () => {
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [offerSDP, setOfferSDP] = useState<any>(null);
  const [answerSDP, setAnswerSDP] = useState<any>(null);

  // Get local audio stream on mount
  useEffect(() => {
    const getLocalStream = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setLocalStream(stream);
        console.log('Local audio stream acquired');
      } catch (error) {
        console.error('getUserMedia error: ', error);
      }
    };
    getLocalStream();

    // Cleanup when component unmounts
    return () => {
      localStream?.getTracks().forEach((track: any) => track.stop());
    };
  }, []);

  // Create and configure RTCPeerConnection
  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(configuration);

    // Add local audio tracks to the peer connection
    if (localStream) {
      localStream.getTracks().forEach((track: any) => {
        peerConnection.addTrack(track, localStream);
      });
    }

    // Handle ICE candidate events
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('New ICE candidate:', event.candidate);
        // In a real application, send this candidate to the remote peer via your signaling server.
      }
    };

    // When a remote track is received, set it as the remote stream
    peerConnection.ontrack = (event) => {
      console.log('Remote track received:', event);
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    setPc(peerConnection);
    return peerConnection;
  };

  // Caller: Create an SDP offer
  const startCall = async () => {
    const peerConnection = pc || createPeerConnection();
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      console.log('Offer created:', offer);
      setOfferSDP(offer);
      // For testing, display the offer so you can manually copy it to the callee
      Alert.alert('SDP Offer', 'Offer generated. Use the "Copy Offer" button to copy it.');
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  // Callee: Set remote description and create an answer
  const answerCall = async () => {
    if (!pc) createPeerConnection();

    // In a real scenario, the offer would come from your signaling server.
    // For testing, we assume that you’ve copied the offer from the caller.
    if (offerSDP) {
      try {
        await pc!.setRemoteDescription(offerSDP);
        const answer = await pc!.createAnswer();
        await pc!.setLocalDescription(answer);
        console.log('Answer created:', answer);
        setAnswerSDP(answer);
        // For testing, display the answer so you can send it back to the caller
        Alert.alert('SDP Answer', 'Answer generated. Use the "Copy Answer" button to copy it.');
      } catch (error) {
        console.error('Error answering call:', error);
      }
    } else {
      Alert.alert('No Offer', 'No SDP offer available. Start a call from the caller first.');
    }
  };

  // Function to copy text to clipboard and alert user
  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert(label, `${label} copied to clipboard.`);
  };

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
        <Button title="Start Call (Caller)" onPress={startCall} />
        <Button title="Answer Call (Callee)" onPress={answerCall} />
      </View>

      {offerSDP && (
        <View style={styles.sdpContainer}>
          <Text style={styles.sdpLabel}>SDP Offer:</Text>
          <Text style={styles.sdpText}>{JSON.stringify(offerSDP, null, 2)}</Text>
          <Button
            title="Copy Offer"
            onPress={() => copyToClipboard(JSON.stringify(offerSDP, null, 2), 'SDP Offer')}
          />
        </View>
      )}

      {answerSDP && (
        <View style={styles.sdpContainer}>
          <Text style={styles.sdpLabel}>SDP Answer:</Text>
          <Text style={styles.sdpText}>{JSON.stringify(answerSDP, null, 2)}</Text>
          <Button
            title="Copy Answer"
            onPress={() => copyToClipboard(JSON.stringify(answerSDP, null, 2), 'SDP Answer')}
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  sdpContainer: {
    width: '100%',
    backgroundColor: '#222',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  sdpLabel: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sdpText: {
    color: '#ccc',
    fontSize: 10,
    marginBottom: 5,
  },
});
