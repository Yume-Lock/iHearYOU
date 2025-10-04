import { registerRootComponent } from 'expo';
import * as Speech from 'expo-speech';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';
import { styles } from './styles';

export default function IHearYouApp() {
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [status, setStatus] = useState('Ready! Tap microphone and say "Blue" or "Red"');
  const [currentColor, setCurrentColor] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const webViewRef = useRef(null);
  const [hasReceivedResult, setHasReceivedResult] = useState(false);

  // Web Speech API HTML content
  const speechRecognitionHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <script>
            let recognition = null;
            let isRecognitionRunning = false;
            let recognitionTimeout = null;

            async function initSpeechRecognition() {
                console.log('WebView: Initializing speech recognition...');
                
                if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                    console.log('WebView: Speech recognition not supported');
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'error',
                        message: 'Speech recognition not supported in this browser'
                    }));
                    return;
                }
                
                try {
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    
                    recognition = new SpeechRecognition();
                    recognition.lang = 'en-US';
                    recognition.continuous = false;
                    recognition.interimResults = false;
                    recognition.maxAlternatives = 3;
                    
                    recognition.onstart = () => {
                        isRecognitionRunning = true;
                        console.log('WebView: Speech recognition started successfully');
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'speechStart'
                        }));
                    };
                    
                    recognition.onresult = (event) => {
                        console.log('WebView: Got speech results:', event.results.length);
                        // Only process the final result
                        if (event.results.length > 0) {
                            const lastResult = event.results[event.results.length - 1];
                            if (lastResult.isFinal) {
                                const transcript = lastResult[0].transcript.toLowerCase().trim();
                                const confidence = lastResult[0].confidence || 0.5;
                                console.log('WebView: Final result:', transcript, 'confidence:', confidence);
                                
                                // Small delay to ensure recognition has fully completed
                                setTimeout(() => {
                                    window.ReactNativeWebView.postMessage(JSON.stringify({
                                        type: 'speechResult',
                                        transcript: transcript,
                                        confidence: confidence
                                    }));
                                }, 100);
                            }
                        }
                    };
                    
                    recognition.onerror = (event) => {
                        isRecognitionRunning = false;
                        console.log('WebView: Speech recognition error:', event.error);
                        
                        if (recognitionTimeout) {
                            clearTimeout(recognitionTimeout);
                            recognitionTimeout = null;
                        }
                        
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'speechError',
                            error: event.error
                        }));
                    };
                    
                    recognition.onend = () => {
                        isRecognitionRunning = false;
                        console.log('WebView: Speech recognition ended');
                        
                        if (recognitionTimeout) {
                            clearTimeout(recognitionTimeout);
                            recognitionTimeout = null;
                        }
                        
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'speechEnd'
                        }));
                    };
                    
                    console.log('WebView: Speech recognition initialized successfully');
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'ready'
                    }));
                    
                } catch (error) {
                    console.log('WebView: Error initializing speech recognition:', error);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'error',
                        message: 'Failed to initialize speech recognition: ' + error.message
                    }));
                }
            }
            
            function startSpeechRecognition() {
                console.log('WebView: startSpeechRecognition called, isRunning:', isRecognitionRunning);
                
                if (!recognition) {
                    console.log('WebView: Recognition not initialized');
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'speechError',
                        error: 'Speech recognition not initialized'
                    }));
                    return;
                }
                
                // Stop any existing recognition first
                if (isRecognitionRunning) {
                    console.log('WebView: Stopping existing recognition first');
                    recognition.stop();
                    setTimeout(() => startSpeechRecognition(), 200);
                    return;
                }
                
                try {
                    console.log('WebView: Starting fresh speech recognition');
                    recognition.start();
                    
                    // Set timeout for auto-stop
                    recognitionTimeout = setTimeout(() => {
                        if (isRecognitionRunning && recognition) {
                            console.log('WebView: Auto-stopping recognition after 5 seconds');
                            recognition.stop();
                        }
                    }, 5000);
                    
                } catch (error) {
                    console.log('WebView: Error starting recognition:', error.message);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'speechError',
                        error: error.message
                    }));
                }
            }
            
            function stopSpeechRecognition() {
                console.log('WebView: stopSpeechRecognition called');
                if (recognition && isRecognitionRunning) {
                    recognition.stop();
                }
                if (recognitionTimeout) {
                    clearTimeout(recognitionTimeout);
                    recognitionTimeout = null;
                }
            }
            
            // Initialize when page loads
            window.addEventListener('load', initSpeechRecognition);
            
            // Also initialize immediately
            initSpeechRecognition();
        </script>
    </body>
    </html>
  `;  // Handle messages from WebView
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
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
          setHasReceivedResult(true); // Mark that we received a result
          setStatus(`🎯 Heard: "${transcript}" (${Math.round(confidence * 100)}% confident)`);
          processSpeech(transcript);
          setIsListening(false);
          break;
          
        case 'speechError':
          const errorMsg = data.error || 'Unknown error';
          setStatus(`❌ Voice error: ${errorMsg}. Try again.`);
          setIsListening(false);
          
          // Auto-retry common errors after a short delay
          if (errorMsg === 'aborted' || errorMsg === 'audio-capture') {
            setTimeout(() => {
              setStatus('Ready! Tap microphone and say "Blue" or "Red"');
            }, 2000);
          }
          break;
          
        case 'speechEnd':
          setIsListening(false);
          // Only show 'no speech detected' if we truly didn't receive any results
          setTimeout(() => {
            if (!hasReceivedResult && !isListening) {
              setStatus('❌ No speech detected. Try speaking louder and clearer.');
              setTimeout(() => {
                setStatus('Ready! Tap microphone and say "Blue" or "Red"');
              }, 2000);
            }
          }, 500);
          break;
          
        case 'error':
          Alert.alert('Error', data.message);
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const startListening = async () => {
    if (!webViewRef.current) {
      setStatus('❌ Speech recognition not ready yet.');
      return;
    }

    try {
      setStatus('🎤 Starting voice recognition...');
      setRecognizedText(''); // Clear previous results
      setHasReceivedResult(false); // Reset result flag
      setIsListening(true);
      
      // Start WebView speech recognition with better error handling
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
  };

  const stopListening = () => {
    if (!webViewRef.current) return;

    try {
      setStatus('⏹️ Processing...');
      setIsListening(false);
      
      // Stop WebView speech recognition
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
  };



  const processSpeech = (spokenText) => {
    console.log('Processing real speech recognition result:', spokenText);
    
    const cleanText = spokenText.trim().toLowerCase();
    
    // Exact word detection for "blue" and "red"
    const containsBlue = cleanText.includes('blue');
    const containsRed = cleanText.includes('red');
    
    // Handle the recognized speech
    if (containsBlue && containsRed) {
      // If both words are detected, prioritize the first one mentioned
      const blueIndex = cleanText.indexOf('blue');
      const redIndex = cleanText.indexOf('red');
      
      if (blueIndex < redIndex) {
        handleColorCommand('blue', '#0066FF', 'Here is the blue screen');
      } else {
        handleColorCommand('red', '#FF0000', 'Here is the red screen');
      }
    } else if (containsBlue) {
      handleColorCommand('blue', '#0066FF', 'Here is the blue screen');
    } else if (containsRed) {
      handleColorCommand('red', '#FF0000', 'Here is the red screen');
    } else {
      handleUnknownCommand(cleanText);
    }
  };

  const handleColorCommand = (color, colorCode, message) => {
    console.log(`Executing ${color} command`);
    
    // Visual output: change background color to the requested color
    setBackgroundColor(colorCode);
    setCurrentColor(color);
    
    // Haptic feedback on mobile devices
    if (Platform.OS !== 'web') {
      Vibration.vibrate(100);
    }
  
    setStatus(`✅ Recognized: "${color}"\n${message}`);
    
    // Auditory output: text-to-speech feedback
    speak(message);
  };

  const handleUnknownCommand = (spokenText) => {
    const shortText = spokenText.length > 30 ? spokenText.substring(0, 30) + '...' : spokenText;
    setStatus(`❌ I only understand "Blue" and "Red".\nYou said: "${shortText}"`);
    speak("Sorry, I only understand the words Blue and Red. Please try again.");
  };

  const speak = (text) => {
    console.log('Speaking:', text);
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.75,
      quality: 'enhanced'
    });
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Test functions for debugging (simulates voice commands)
  const testBlueCommand = () => {
    console.log('Testing blue command');
    processSpeech('blue');
  };

  const testRedCommand = () => {
    console.log('Testing red command');
    processSpeech('red');
  };

  const resetApp = () => {
    setBackgroundColor('#ffffff');
    setCurrentColor('');
    setRecognizedText('');
    setHasReceivedResult(false);
    setStatus('Ready! Tap microphone and say "Blue" or "Red"');
    
    // Stop any ongoing voice recognition
    if (isListening) {
      stopListening();
    }
  };



  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style="auto" />
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>IHearYou</Text>
          <Text style={styles.subtitle}>hello, friend!</Text>
        </View>

        {/* Hidden WebView for Speech Recognition */}
        <WebView
          ref={webViewRef}
          source={{ html: speechRecognitionHTML }}
          style={{ height: 1, width: 1, opacity: 0 }}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          mixedContentMode="compatibility"
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          allowsFullscreenVideo={true}
          allowsProtectedMedia={true}
          originWhitelist={['*']}
          onPermissionRequest={(request) => {
            request.grant();
          }}
        />

        {/* Combined Instructions & Status */}
        <View style={styles.combinedInstructionBox}>
          <Text style={styles.instructionText}>
            Tap microphone → Say "Blue" or "Red" → Get response!
          </Text>
          <View style={styles.statusDivider} />
          <Text style={styles.statusText}>{status}</Text>
        </View>

        {/* Microphone Button */}
        <TouchableOpacity
          style={[
            styles.micButton,
            isListening && styles.micButtonListening
          ]}
          onPress={toggleListening}
          activeOpacity={0.8}
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

        {/* Recognition result display */}
        {recognizedText && (
          <View style={styles.stateBox}>
            <Text style={styles.stateText}>
              🎤 Last recognized: "{recognizedText}"
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