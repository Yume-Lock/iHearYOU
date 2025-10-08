import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: [string, string, ...string[]];
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ 
  children, 
  colors = ['#000000', '#1a1a2e', '#16213e'] 
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={[0, 0]}
      end={[1, 1]}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
};