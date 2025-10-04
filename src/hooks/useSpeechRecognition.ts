import * as Speech from 'expo-speech';
import { useCallback, useRef, useState } from 'react';
import { Alert, Platform, Vibration } from 'react-native';
import { WebView } from 'react-native-webview';
import { SupportedColor, WebViewMessage } from '../types/speech';
import { SpeechProcessor } from '../utils/SpeechProcessor';

/**
 * hook for managing speech recognition functionality
 */
export const useSpeechRecognition = () => {
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [status, setStatus] = useState<string>('Ready! Tap microphone and say "Blue" or "Red"');
  const [currentColor, setCurrentColor] = useState<SupportedColor | ''>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [hasReceivedResult, setHasReceivedResult] = useState<boolean>(false);
  
  const webViewRef = useRef<WebView>(null);

  /**
   * messages from speech recognition
   */
  const handleWebViewMessage = useCallback((event: any) => {
    try {
      const data: WebViewMessage = JSON.parse(event.nativeEvent.data);
      
      switch(data.type) {
        case 'ready':
          setStatus('Ready! Tap microphone and say "Blue" or "Red"');
          break;
          
        case 'speechStart':
          setStatus('🔴 Listening... Say "Blue" or "Red"');
          setIsListening(true);
          break;
          
        case 'speechResult':
          const transcript = data.transcript || '';
          const confidence = data.confidence || 0;
          console.log('Received speech result:', transcript, 'confidence:', confidence);
          
          setRecognizedText(transcript);
          setHasReceivedResult(true);
          setStatus(`🎯 Heard: "${transcript}" (${Math.round(confidence * 100)}% confident)`);
          
          processSpeech(transcript);
          setIsListening(false);
          break;
          
        case 'speechError':
          const errorMsg = data.error || 'Unknown error';
          setStatus(`❌ Voice error: ${errorMsg}. Try again.`);
          setIsListening(false);
          
          // auto-retry common errors after a short delay
          if (errorMsg === 'aborted' || errorMsg === 'audio-capture') {
            setTimeout(() => {
              setStatus('Ready! Tap microphone and say "Blue" or "Red"');
            }, 2000);
          }
          break;
          
        case 'speechEnd':
          setIsListening(false);
          // only show 'no speech detected' if we truly didn't receive any results
          setTimeout(() => {
            if (!hasReceivedResult && !isListening) {
              setStatus('No speech detected. Try speaking louder and clearer.');
              setTimeout(() => {
                setStatus('Ready! Tap microphone and say "Blue" or "Red"');
              }, 2000);
            }
          }, 500);
          break;
          
        case 'error':
          Alert.alert('Error', data.message || 'Unknown error occurred');
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  }, [hasReceivedResult, isListening]);

  /**
   * processes speech recognition out;
   */
  const processSpeech = useCallback((spokenText: string) => {
    console.log('Processing real speech recognition result:', spokenText);
    
    const command = SpeechProcessor.processCommand(spokenText);
    
    if (command) {
      handleColorCommand(command.color, command.backgroundColor, command.message);
    } else {
      handleUnknownCommand(spokenText);
    }
  }, []);

  /**
   * handles valid color commands
   */
  const handleColorCommand = useCallback((color: SupportedColor, bgColor: string, message: string) => {
    console.log(`Executing ${color} command`);
    
    // haptic feedback
    if (Platform.OS !== 'web') {
      Vibration.vibrate(100);
    }
    
    setBackgroundColor(bgColor);
    setCurrentColor(color);
    setStatus(`✅ ${color.toUpperCase()} activated!`);

    // audio out;
    speak(message);

    // reset to ready state after 3 seconds
    setTimeout(() => {
      setStatus('Ready! Tap microphone and say "Blue" or "Red"');
    }, 3000);
  }, []);

  /**
   *
   */
  const handleUnknownCommand = useCallback((spokenText: string) => {
    const shortText = spokenText.length > 30 ? spokenText.substring(0, 30) + '...' : spokenText;
    setStatus(`❌ I only understand "Blue" and "Red".\\nYou said: "${shortText}"`);
    speak("Sorry, I only understand the words Blue and Red. Please try again.");
  }, []);

  /**
   * tts
   */
  const speak = useCallback((text: string) => {
    console.log('Speaking:', text);
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.75
    });
  }, []);

  /**
   * starts speech recognition
   */
  const startListening = useCallback(async () => {
    if (!webViewRef.current) {
      setStatus('❌ Speech recognition not ready yet.');
      return;
    }

    try {
      setStatus('🎤 Starting voice recognition...');
      setRecognizedText('');
      setHasReceivedResult(false);
      setIsListening(true);
      
      webViewRef.current.injectJavaScript(`
        console.log('React Native: Starting speech recognition');
        if (typeof startSpeechRecognition === 'function') {
          startSpeechRecognition();
        } else {
          console.log('React Native: startSpeechRecognition function not found');
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'speechError',
            error: 'Speech recognition function not available'
          }));
        }
        true;
      `);
      
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      setStatus('❌ Error starting voice recognition.');
      setIsListening(false);
    }
  }, []);

  /**
   * stop speech recognition
   */
  const stopListening = useCallback(() => {
    if (!webViewRef.current) return;

    try {
      setStatus('⏹️ Processing...');
      setIsListening(false);

      // stop webview speech recognition
      webViewRef.current.injectJavaScript(`
        console.log('React Native: Stopping speech recognition');
        if (typeof stopSpeechRecognition === 'function') {
          stopSpeechRecognition();
        }
        true;
      `);
      
    } catch (error) {
      console.error('Failed to stop voice recognition:', error);
      setStatus('❌ Error stopping voice recognition.');
      setIsListening(false);
    }
  }, []);

  /**
   * toggle speech recognition on/off
   */
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const resetApp = useCallback(() => {
    setBackgroundColor('#ffffff');
    setCurrentColor('');
    setRecognizedText('');
    setHasReceivedResult(false);
    setStatus('Ready! Tap microphone and say "Blue" or "Red"');

    if (isListening) {
      stopListening();
    }
  }, [isListening, stopListening]);

  const testBlueCommand = useCallback(() => {
    console.log('Testing blue command');
    processSpeech('blue');
  }, [processSpeech]);

  const testRedCommand = useCallback(() => {
    console.log('Testing red command');
    processSpeech('red');
  }, [processSpeech]);

  return {
    backgroundColor,
    status,
    currentColor,
    isListening,
    recognizedText,
    webViewRef,

    handleWebViewMessage,
    toggleListening,
    resetApp,
    testBlueCommand,
    testRedCommand
  };
};