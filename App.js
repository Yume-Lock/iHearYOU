import { registerRootComponent } from 'expo';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';
import { styles } from './styles';

export default function IHearYouApp() {
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [status, setStatus] = useState('Tap the microphone to start listening');
  const [currentColor, setCurrentColor] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [recording, setRecording] = useState(null);

  // permissions for mic - on app start;
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status === 'granted') {
        setStatus('Ready! Tap microphone and say "Blue" or "Red"');
      } else {
        setStatus('Microphone permission required for voice commands.');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setHasPermission(false);
      setStatus('Error initializing audio.');
    }
  };

  const startListening = async () => {
    if (!hasPermission) {
      setStatus('ERROR: please grant microphone permission first.');
      return;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsListening(true);
      setStatus('🎤 Listening... Say "Blue" or "Red"');

    } catch (error) {
      console.error('Failed to start recording:', error);
      setStatus('Failed to start recording. Please try again.');
    }
  };

  const stopListening = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      setIsListening(false);
      setRecording(null);

      // simulate speech recognition
      simulateSpeechRecognition();

    } catch (error) {
      console.error('Failed to stop recording:', error);
      setStatus('❌ Error stopping recording.');
      setIsListening(false);
      setRecording(null);
    }
  };

  //  speech recognition
  const simulateSpeechRecognition = () => {
    setStatus(`🔍 Processing your command...`);
  
    setTimeout(() => {
      const recognitionResults = simulateRealisticSpeechDetection();
      processSpeech(recognitionResults);
    }, 1500);
  };

  const simulateRealisticSpeechDetection = () => {
    const scenarios = [
      // high accuracy scenarios (80%)
      { text: 'blue', weight: 35 },
      { text: 'red', weight: 35 },
      { text: 'blue screen', weight: 5 },
      { text: 'red screen', weight: 5 },
      
      // moderate accuracy scenarios (15%)
      { text: 'blu', weight: 3 },
      { text: 'blew', weight: 2 },
      { text: 'rad', weight: 3 },
      { text: 'read', weight: 2 },
      { text: 'bloo', weight: 2 },
      { text: 'rid', weight: 3 },
      
      // low accuracy/unclear scenarios (5%)
      { text: 'unclear audio', weight: 2 },
      { text: 'background noise', weight: 1 },
      { text: 'hello', weight: 1 },
      { text: 'something else', weight: 1 }
    ];
  
    // create selection
    const totalWeight = scenarios.reduce((sum, scenario) => sum + scenario.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const scenario of scenarios) {
      random -= scenario.weight;
      if (random <= 0) {
        console.log('Speech recognition result:', scenario.text);
        return scenario.text;
      }
    }
    
    // fallback
    return Math.random() > 0.5 ? 'blue' : 'red';
  };

  const processSpeech = (spokenText) => {
    console.log('Processing speech:', spokenText);
    
    const cleanText = spokenText.trim().toLowerCase();
    
    // color detection with multiple variations and phonetic similarities
    const bluePatterns = [
      'blue', 'blu', 'blew', 'bloo', 'bleu'
    ];
    
    const redPatterns = [
      'red', 'rad', 'rid', 'read'
    ];
    
    // check for blue patterns
    const hasBlue = bluePatterns.some(pattern => 
      cleanText.includes(pattern) || 
      cleanText.startsWith(pattern) || 
      cleanText.endsWith(pattern)
    );
    
    // check for red patterns
    const hasRed = redPatterns.some(pattern => 
      cleanText.includes(pattern) || 
      cleanText.startsWith(pattern) || 
      cleanText.endsWith(pattern)
    );
    
    // prioritize exact matches and handle conflicts
    if (hasBlue && hasRed) {
      // if both detected, prioritize the one that appears first or is more prominent
      const blueIndex = Math.min(...bluePatterns.map(p => cleanText.indexOf(p)).filter(i => i >= 0));
      const redIndex = Math.min(...redPatterns.map(p => cleanText.indexOf(p)).filter(i => i >= 0));
      
      if (blueIndex < redIndex || blueIndex === 0) {
        handleColorCommand('blue', '#1E90FF', 'Here is the blue screen');
      } else {
        handleColorCommand('red', '#FF4444', 'Here is the red screen');
      }
    } else if (hasBlue) {
      handleColorCommand('blue', '#1E90FF', 'Here is the blue screen');
    } else if (hasRed) {
      handleColorCommand('red', '#FF4444', 'Here is the red screen');
    } else {
      handleUnknownCommand(cleanText);
    }
  };

  const handleColorCommand = (color, colorCode, message) => {
    // visual output: change background color
    setBackgroundColor(colorCode);
    setCurrentColor(color);
    
    // haptic feedback on mobile
    if (Platform.OS !== 'web') {
      Vibration.vibrate(100);
    }
  
    setStatus(`You said: "${color}"\n${message}`);
    
    // audible out
    speak(message);
  };

  const handleUnknownCommand = (spokenText) => {
    const shortText = spokenText.length > 20 ? spokenText.substring(0, 20) + '...' : spokenText;
    setStatus(`❌ Sorry, I only understand "Blue" and "Red".\nYou said: "${shortText}"`);
    speak("Sorry, I only understand Blue and Red. Please try again.");
  };

  const speak = (text) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.8,
    });
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const testBlueCommand = () => {
    handleColorCommand('blue', '#1E90FF', 'Here is the blue screen');
  };

  const testRedCommand = () => {
    handleColorCommand('red', '#FF4444', 'Here is the red screen');
  };

  const resetApp = () => {
    setBackgroundColor('#ffffff');
    setCurrentColor('');
    setStatus('🎤 Ready! Tap microphone and say "Blue" or "Red"');
    setIsListening(false);
    if (recording) {
      recording.stopAndUnloadAsync();
      setRecording(null);
    }
  };

  // permission loading state
  if (hasPermission === null) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: '#ffffff' }]}>
        <StatusBar style="auto" />
        <Text style={styles.loadingText}>🎤 Requesting microphone permissions...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style="auto" />
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        
        {/* top level */}
        <View style={styles.header}>
          <Text style={styles.title}>IHearYou</Text>
          <Text style={styles.subtitle}>hello, friend!</Text>
        </View>

        {/* instructions + status */}
        <View style={styles.combinedInstructionBox}>
          <Text style={styles.instructionText}>
            {hasPermission 
              ? 'Tap microphone → Record command → See & hear response!' 
              : 'ERROR: microphone permission required for voice commands.'
            }
          </Text>
          <View style={styles.statusDivider} />
          <Text style={styles.statusText}>{status}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.micButton,
            isListening && styles.micButtonListening
          ]}
          onPress={toggleListening}
          activeOpacity={0.8}
          disabled={!hasPermission}
        >
          <Text style={styles.micButtonText}>
            {isListening ? '🔴' : '🎤'}
          </Text>
          <Text style={styles.micButtonSubtext}>
            {isListening ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </TouchableOpacity>

        {/* state display */}
        {currentColor && (
          <View style={styles.stateBox}>
            <Text style={styles.stateText}>
              🎨 Current: {currentColor.charAt(0).toUpperCase() + currentColor.slice(1)} Screen
            </Text>
          </View>
        )}

        {/* test buttons */}
        <View style={styles.testButtonsContainer}>
          <Text style={styles.testButtonsTitle}>Test Commands:</Text>
          <View style={styles.testButtonsRow}>
            <TouchableOpacity style={[styles.testButton, styles.blueButton]} onPress={testBlueCommand}>
              <Text style={styles.testButtonText}>Blue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.testButton, styles.redButton]} onPress={testRedCommand}>
              <Text style={styles.testButtonText}>Red</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetApp}>
          <Text style={styles.resetText}>🔄 Reset</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

// register the main component with expo
registerRootComponent(IHearYouApp);