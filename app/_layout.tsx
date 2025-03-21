import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ActiveStreamProvider } from '../contexts/ActiveStreamContext';
import { StreamingProvider } from '@/contexts/StreamingContext';
import { StreamTimesProvider } from '@/contexts/StreamTimesContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'InstrumentSans-Regular': require('../assets/fonts/Instrument_Sans/InstrumentSans_Condensed-Regular.ttf'),
    'InstrumentSans-Medium': require('../assets/fonts/Instrument_Sans/InstrumentSans_Condensed-Medium.ttf'),
    'InstrumentSans-SemiBold': require('../assets/fonts/Instrument_Sans/InstrumentSans_Condensed-SemiBold.ttf'),
    'InstrumentSans-Bold': require('../assets/fonts/Instrument_Sans/InstrumentSans_Condensed-Bold.ttf'),
    'InstrumentSans-Italic': require('../assets/fonts/Instrument_Sans/InstrumentSans_Condensed-Italic.ttf'),
    'InstrumentSans-MediumItalic': require('../assets/fonts/Instrument_Sans/InstrumentSans_Condensed-MediumItalic.ttf'),
    'InstrumentSans-SemiBoldItalic': require('../assets/fonts/Instrument_Sans/InstrumentSans_Condensed-SemiBoldItalic.ttf'),
    'InstrumentSans-BoldItalic': require('../assets/fonts/Instrument_Sans/InstrumentSans_Condensed-BoldItalic.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <StreamingProvider>
      <ActiveStreamProvider>
        <StreamTimesProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="stream"
                options={{
                  gestureEnabled: true,
                  gestureDirection: 'vertical',
                  animationDuration: 400,
                  headerShown: false,
                  animation: 'slide_from_bottom'
                }}
              />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </StreamTimesProvider>
      </ActiveStreamProvider>
    </StreamingProvider>
  );
}