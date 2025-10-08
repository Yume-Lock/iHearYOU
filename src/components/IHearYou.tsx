import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { SpeechRecognitionService } from '../services/SpeechRecognitionService';
import { styles } from '../styles/styles';
import { GradientBackground } from './GradientBackground';
import { Logo } from './Logo';
import { PulseAnimation, SiriWaveAnimation } from './SiriAnimations';

/**
 * IHearYou;
 */
export default function IHearYou(): React.JSX.Element {
  const {
    backgroundColor,
    status,
    currentColor,
    isListening,
    recognizedText,
    webViewRef,
    handleWebViewMessage,
    toggleListening,
    resetApp
  } = useSpeechRecognition();

  return (
    <GradientBackground 
      colors={
        backgroundColor === '#ffffff' 
          ? ['#000000', '#1a1a2e', '#16213e']
          : backgroundColor === '#2196F3' 
          ? ['#1565C0', '#1976D2', '#0D47A1']
          : ['#C62828', '#D32F2F', '#B71C1C']
      }
    >
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <StatusBar style="light" />
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >

        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <PulseAnimation isActive={isListening} scale={1.05}>
              <View style={styles.logoContainer}>
                <Logo width={140} height={140} />
              </View>
            </PulseAnimation>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>IHearYou</Text>
              <Text style={styles.subtitle}>hello, friend!</Text>
            </View>
          </View>

          {/* instructions */}
          <View style={styles.headerInstructions}>
            <Text style={styles.headerInstructionsText}>Say "Blue" or "Red" to change colors.</Text>
            <TouchableOpacity
              style={styles.headerResetButton}
              onPress={() => {
                Alert.alert(
                  'Reset App',
                  'Clear current state?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Reset', onPress: resetApp, style: 'destructive' }
                  ]
                );
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.headerResetButtonText}>🔄</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* hidden webview for speech recognition */}
        <WebView
          ref={webViewRef}
          source={{ html: SpeechRecognitionService.getWebViewHTML() }}
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
        />

        <View style={{ position: 'relative', alignItems: 'center' }}>
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
              {isListening ? 'Listening...' : 'Tap to Speak'}
            </Text>
          </TouchableOpacity>

          <SiriWaveAnimation isListening={isListening} size={160} />
        </View>

        {(currentColor || recognizedText) && (
          <View style={styles.combinedStatusBox}>
            {currentColor && (
              <Text style={styles.combinedStatusText}>
                🎨 Current: {currentColor.toUpperCase()}
              </Text>
            )}
            {recognizedText && (
              <Text style={styles.combinedStatusText}>
                Heard: "{recognizedText}"
              </Text>
            )}
          </View>
        )}
      </ScrollView>
      </View>
    </GradientBackground>
  );
}