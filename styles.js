import { Dimensions, StyleSheet } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#f8f9fa',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 20,
    minHeight: '100%',
  },

  header: {
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
    width: '100%',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    fontWeight: '500',
    fontStyle: 'italic',
    width: '100%',
    paddingHorizontal: 10,
    lineHeight: 24,
  },

  combinedInstructionBox: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(52,152,219,0.15)',
    width: screenWidth - 40,
    maxWidth: 400,
  },
  instructionText: {
    fontSize: 16,
    color: '#34495e',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  statusDivider: {
    width: '70%',
    height: 2,
    backgroundColor: 'rgba(52,152,219,0.3)',
    marginVertical: 12,
    borderRadius: 1,
  },
  statusText: {
    fontSize: 17,
    color: '#3498db',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
  },

  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    marginVertical: 15,
    borderWidth: 3,
    borderColor: 'rgba(52,152,219,0.2)',
  },
  micButtonListening: {
    backgroundColor: '#fff5f5',
    borderColor: '#e74c3c',
    shadowColor: '#e74c3c',
    transform: [{ scale: 1.05 }],
  },
  micButtonText: {
    fontSize: 40,
    marginBottom: 4,
  },
  micButtonSubtext: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },

  stateBox: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  stateText: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '700',
    textAlign: 'center',
  },

  testButtonsContainer: {
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  testButtonsTitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  testButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    maxWidth: 300,
  },
  testButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  blueButton: {
    backgroundColor: '#3498db',
    borderWidth: 2,
    borderColor: '#2980b9',
  },
  redButton: {
    backgroundColor: '#e74c3c',
    borderWidth: 2,
    borderColor: '#c0392b',
  },
  testButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(149,165,166,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 44,
  },
  resetText: {
    fontSize: 15,
    color: '#7f8c8d',
    fontWeight: '600',
    marginLeft: 8,
  },

  loadingText: {
    fontSize: 20,
    color: '#3498db',
    fontWeight: '600',
    textAlign: 'center',
  },

  // adjustments for smaller screens
  ...(screenHeight < 700 && {
    container: {
      paddingTop: 40,
    },
    title: {
      fontSize: 36,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 20,
    },
    micButton: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    micButtonText: {
      fontSize: 32,
    },
    combinedInstructionBox: {
      padding: 18,
      marginVertical: 12,
    },
    testButtonsContainer: {
      marginVertical: 12,
    },
    resetButton: {
      marginTop: 12,
      marginBottom: 15,
      paddingVertical: 8,
    },
  }),
});

// themes for different states
export const colorThemes = {
  default: '#f8f9fa',
  blue: '#3498db',
  red: '#e74c3c',
  blueGradient: ['#74b9ff', '#0984e3'],
  redGradient: ['#fd79a8', '#e84393'],
};

export const animations = {
  buttonPress: {
    scale: 0.95,
    duration: 150,
  },
  colorTransition: {
    duration: 300,
  },
  micPulse: {
    scale: [1, 1.1, 1],
    duration: 1000,
  },
};

export default styles;