import { StyleSheet, Platform, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { router } from 'expo-router';

const styles = StyleSheet.create({
  header: {
    height: Platform.select({
      web: 60,
      ios: 60,
      default: 80,
    }),
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#64a675',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    maxWidth: 850,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    left: 8,
    top: Platform.select({
      web: 8,
      ios: 8,
      default: 20,
    }),
    width: 44,  // Minimum tap target size
    height: 44, // Minimum tap target size
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  streamButton: {
    position: 'absolute',
    right: 16,
    top: Platform.select({
      web: 12,
      ios: 12,
      default: 24,
    }),
    backgroundColor: '#486B52',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  headerLogo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700', // Changed from 500 to 700 for bolder text
    color: 'black',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    top: Platform.select({
      web: 12,
      ios: 12,
      default: 24,
    }),
  },
  modeText: {
    position: 'absolute',
    right: 64, // This positions it to the left of the toggle button
    top: Platform.select({
      web: 20,
      ios: 20,
      default: 32,
    }),
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
});

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  isStreamPage?: boolean; // Add this new prop
}

export const Header: React.FC<HeaderProps> = ({ 
  showBack = false, 
  onBack = () => router.push('/(tabs)'),
  isStreamPage = false // Add default value
}) => {
  const isWeb = Platform.OS === 'web';

  return (
    <ThemedView style={styles.header}>
      <View style={styles.headerContent}>
        {showBack && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name="arrow-back" 
              size={32} 
              color="#000" 
            />
          </TouchableOpacity>
        )}
        
        {showBack && (
          <View style={styles.headerCenter}>
            <Image 
              source={require('../assets/images/musen-white.png')}
              style={styles.headerLogo}
            />
            <ThemedText style={styles.headerTitle}>
              musen
            </ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );
};