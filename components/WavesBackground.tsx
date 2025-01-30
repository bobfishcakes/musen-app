import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Svg, Rect } from 'react-native-svg';

const WavesBackground = () => {
  const height1 = useRef(new Animated.Value(40)).current;
  const height2 = useRef(new Animated.Value(60)).current;
  const height3 = useRef(new Animated.Value(80)).current;
  const height4 = useRef(new Animated.Value(100)).current;
  const height5 = useRef(new Animated.Value(90)).current;
  const height6 = useRef(new Animated.Value(70)).current;
  const height7 = useRef(new Animated.Value(50)).current;
  const height8 = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    const animate = (value: Animated.Value, maxHeight: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: maxHeight,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(value, {
            toValue: 40,
            duration: 1200,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    // Staggered animations with different heights
    setTimeout(() => animate(height1, 140), 0);
    setTimeout(() => animate(height2, 120), 150);
    setTimeout(() => animate(height3, 100), 300);
    setTimeout(() => animate(height4, 130), 450);
    setTimeout(() => animate(height5, 110), 600);
    setTimeout(() => animate(height6, 140), 750);
    setTimeout(() => animate(height7, 120), 900);
    setTimeout(() => animate(height8, 130), 1050);
  }, [height1, height2, height3, height4, height5, height6, height7, height8]);

  return (
    <Svg height="200" width="320">
      <AnimatedRect x="10" y="10" width="20" height={height1} rx="10" ry="10" fill="#3A5241" />
      <AnimatedRect x="45" y="10" width="20" height={height2} rx="10" ry="10" fill="#3A5241" />
      <AnimatedRect x="80" y="10" width="20" height={height3} rx="10" ry="10" fill="#3A5241" />
      <AnimatedRect x="115" y="10" width="20" height={height4} rx="10" ry="10" fill="#3A5241" />
      <AnimatedRect x="150" y="10" width="20" height={height5} rx="10" ry="10" fill="#3A5241" />
      <AnimatedRect x="185" y="10" width="20" height={height6} rx="10" ry="10" fill="#3A5241" />
      <AnimatedRect x="220" y="10" width="20" height={height7} rx="10" ry="10" fill="#3A5241" />
      <AnimatedRect x="255" y="10" width="20" height={height8} rx="10" ry="10" fill="#3A5241" />
    </Svg>
  );
};

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export default WavesBackground;