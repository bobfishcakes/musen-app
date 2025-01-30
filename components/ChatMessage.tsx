import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

type ChatMessageProps = {
  username: string;
  message: string;
};

export function ChatMessage({ username, message }: ChatMessageProps) {
  return (
    <View style={styles.messageContainer}>
      <ThemedText style={styles.username}>{username}: </ThemedText>
      <ThemedText>{message}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    padding: 8,
  },
  username: {
    fontWeight: 'bold',
  },
});