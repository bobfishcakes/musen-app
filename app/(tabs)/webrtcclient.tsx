import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {
  RTCPeerConnection,
  mediaDevices,
  MediaStream as RCTMediaStream,
} from 'react-native-webrtc';

// Extend the MediaStream type to include optional event properties
interface CustomMediaStream extends RCTMediaStream {
  onaddtrack?: ((ev: any) => void) | null;
  onremovetrack?: ((ev: any) => void) | null;
}

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

const WebRTCClient: React.FC = () => {
  const [localStream, setLocalStream] = useState<CustomMediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<CustomMediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

  // Request local audio stream on component mount
  useEffect(() => {
    const getLocalAudioStream = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setLocalStream(stream as CustomMediaStream);
        console.log('Local audio stream acquired');
      } catch (error) {
        console.error('Failed to get local audio stream:', error);
      }
    };

    getLocalAudioStream();

    // Cleanup on unmount
    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Create and configure the RTCPeerConnection
  const createPeerConnection = (): RTCPeerConnection => {
    const pc = new RTCPeerConnection(configuration);

    // Add local audio tracks to the peer connection
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    // Use a cast to "any" to set the ICE candidate handler
    (pc as any).onicecandidate = (event: any) => {
      if (event.candidate) {
        console.log('New ICE candidate:', event.candidate);
        // TODO: Send the candidate to the remote peer via your signaling server
      }
    };

    // Handle incoming remote audio tracks
    (pc as any).ontrack = (event: any) => {
      console.log('Received remote audio track:', event);
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0] as CustomMediaStream);
      }
    };

    setPeerConnection(pc);
    return pc;
  };

  // Start the call by creating an SDP offer
  const startCall = async () => {
    const pc = peerConnection || createPeerConnection();
    try {
      const offer = await pc.createOffer({}); // Passing an empty options object
      await pc.setLocalDescription(offer);
      console.log('SDP Offer created:', offer);
      // --- Loopback simulation ---
      // Instead of waiting for a remote answer via signaling,
      // immediately set the remote stream to the local stream.
      if (localStream) {
        setRemoteStream(localStream as CustomMediaStream);
        console.log('Simulated remote stream set from local stream');
      }
      // ---------------------------
      // In a real scenario, you'd send the offer to a remote peer
      // and wait for an answer and ICE candidates.
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Audio-Only WebRTC Client</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {localStream ? 'Local audio is active.' : 'Acquiring local audio...'}
        </Text>
        <Text style={styles.infoText}>
          {remoteStream ? 'Remote audio connected.' : 'Waiting for remote audio...'}
        </Text>
      </View>
      <Button title="Start Call" onPress={startCall} />
    </View>
  );
};

export default WebRTCClient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
});
