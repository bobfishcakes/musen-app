import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ChatMessage } from '@/components/ChatMessage';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import WavesBackground from '../../components/WavesBackground';

export default function TabTwoScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const streamTitle = "Live Stream Title";
  
  const messages = [
    { username: "user1", message: "Hello!" },
    { username: "user2", message: "Great stream!" },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage('');
    }
  };

  const handleBack = () => {
    // Handle back action
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <ThemedText style={styles.title}>{streamTitle}</ThemedText>
          <ThemedText style={styles.subtitle}>@StreamerName</ThemedText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <ThemedText>Follow</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.donateButton]}>
              <ThemedText>Donate</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.contentArea}>
          {isPlaying && (
            <View style={styles.wavesBackground}>
              <WavesBackground/>
            </View>
          )}
          <TouchableOpacity 
            onPress={() => setIsPlaying(!isPlaying)}
            style={styles.playButton}
          >
            <Ionicons 
              name={isPlaying ? 'pause-circle' : 'play-circle'} 
              size={80} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>

        {/* Chat Section */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.chatSection}>
            <View style={{ flex: 1, width: '100%' }}>
              <ScrollView style={styles.chatScroll}>
                {messages.map((msg, index) => (
                  <ChatMessage 
                    key={index}
                    username={msg.username}
                    message={msg.message}
                  />
                ))}
              </ScrollView>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Type a message..."
                  placeholderTextColor="#666"
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                  <Ionicons name="send" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 15,
  },
  titleSection: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  donateButton: {
    backgroundColor: '#3A5241',
  },
  contentArea: {
    flex: 0.25, // 25% of screen height
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Add this
    overflow: 'hidden', // Add this
  },
  playButton: {
    padding: 20,
  },
  chatSection: {
    flex: 0.85,
    position: 'relative',
  },
  chatScroll: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginRight: 10,
    color: '#fff',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  wavesBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  }
});
