import { Text, type TextProps, StyleSheet, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}
const styles = StyleSheet.create({
  default: {
    fontSize: Platform.select({
      web: 32, // 60% larger on web
      default: 20,
    }),
    lineHeight: Platform.select({
      web: 38,
      default: 24,
    }),
    fontFamily: 'InstrumentSans-Regular',
  },
  defaultSemiBold: {
    fontSize: Platform.select({
      web: 24, // 50% larger on web
      default: 16,
    }),
    lineHeight: Platform.select({
      web: 36,
      default: 24,
    }),
    fontWeight: '600',
    fontFamily: 'InstrumentSans-SemiBold',
  },
  title: {
    fontSize: Platform.select({
      web: 96, // 50% larger on web
      default: 64,
    }),
    fontWeight: 'bold',
    lineHeight: Platform.select({
      web: 96,
      default: 64,
    }),
    fontFamily: 'InstrumentSans-Bold',
  },
  subtitle: {
    fontSize: Platform.select({
      web: 45, // 50% larger on web
      default: 32,
    }),
    fontWeight: 'bold',
    fontFamily: 'InstrumentSans-Bold',
  },
  link: {
    fontSize: Platform.select({
      web: 24, // 50% larger on web
      default: 16,
    }),
    lineHeight: Platform.select({
      web: 45,
      default: 30,
    }),
    color: '#0a7ea4',
    fontFamily: 'InstrumentSans-Regular',
  },
});