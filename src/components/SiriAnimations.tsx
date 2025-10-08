import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

interface SiriWaveProps {
  isListening: boolean;
  size?: number;
}

export const SiriWaveAnimation: React.FC<SiriWaveProps> = ({ 
  isListening, 
  size = 200 
}) => {
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;
  const wave4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isListening) {
      // start wave animations with different phases
      const animation1 = Animated.loop(
        Animated.sequence([
          Animated.timing(wave1, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(wave1, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      );

      const animation2 = Animated.loop(
        Animated.sequence([
          Animated.timing(wave2, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(wave2, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      );

      const animation3 = Animated.loop(
        Animated.sequence([
          Animated.timing(wave3, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(wave3, {
            toValue: 0,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      );

      const animation4 = Animated.loop(
        Animated.sequence([
          Animated.timing(wave4, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(wave4, {
            toValue: 0,
            duration: 900,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      );

      animation1.start();
      animation2.start();
      animation3.start();
      animation4.start();
    } else {
      // reset animations when not listening
      Animated.timing(wave1, { toValue: 0, duration: 300, useNativeDriver: false }).start();
      Animated.timing(wave2, { toValue: 0, duration: 300, useNativeDriver: false }).start();
      Animated.timing(wave3, { toValue: 0, duration: 300, useNativeDriver: false }).start();
      Animated.timing(wave4, { toValue: 0, duration: 300, useNativeDriver: false }).start();
    }
  }, [isListening]);

  const baseWaveStyle = {
    width: 4,
    height: size * 0.6,
    backgroundColor: '#3498db',
    borderRadius: 2,
    marginHorizontal: 2,
  };

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: size,
      position: 'absolute' as const,
      width: '100%',
    }}>
      <Animated.View style={[
        baseWaveStyle,
        {
          transform: [{
            scaleY: wave1.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1.5]
            })
          }],
          opacity: wave1.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0.8]
          })
        }
      ]} />
      <Animated.View style={[
        baseWaveStyle,
        {
          transform: [{
            scaleY: wave2.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 1.2]
            })
          }],
          opacity: wave2.interpolate({
            inputRange: [0, 1],
            outputRange: [0.4, 0.7]
          })
        }
      ]} />
      <Animated.View style={[
        baseWaveStyle,
        {
          transform: [{
            scaleY: wave3.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 1.8]
            })
          }],
          opacity: wave3.interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 0.6]
          })
        }
      ]} />
      <Animated.View style={[
        baseWaveStyle,
        {
          transform: [{
            scaleY: wave4.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 1.0]
            })
          }],
          opacity: wave4.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 0.9]
          })
        }
      ]} />
      <Animated.View style={[
        baseWaveStyle,
        {
          transform: [{
            scaleY: wave2.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 1.2]
            })
          }],
          opacity: wave2.interpolate({
            inputRange: [0, 1],
            outputRange: [0.4, 0.7]
          })
        }
      ]} />
      <Animated.View style={[
        baseWaveStyle,
        {
          transform: [{
            scaleY: wave1.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1.5]
            })
          }],
          opacity: wave1.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0.8]
          })
        }
      ]} />
      <Animated.View style={[
        baseWaveStyle,
        {
          transform: [{
            scaleY: wave4.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 1.0]
            })
          }],
          opacity: wave4.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 0.9]
          })
        }
      ]} />
      <Animated.View style={[
        baseWaveStyle,
        {
          transform: [{
            scaleY: wave3.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 1.8]
            })
          }],
          opacity: wave3.interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 0.6]
          })
        }
      ]} />
    </View>
  );
};

interface PulseAnimationProps {
  isActive: boolean;
  children: React.ReactNode;
  scale?: number;
}

export const PulseAnimation: React.FC<PulseAnimationProps> = ({ 
  isActive, 
  children, 
  scale = 1.1 
}) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: scale,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    } else {
      Animated.timing(pulse, { 
        toValue: 1, 
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isActive, scale]);

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      {children}
    </Animated.View>
  );
};