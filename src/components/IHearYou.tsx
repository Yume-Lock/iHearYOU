import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { SpeechRecognitionService } from '../services/SpeechRecognitionService';
import { styles } from '../styles/styles';

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
    resetApp,
    testBlueCommand,
    testRedCommand
  } = useSpeechRecognition();

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style="auto" />
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>IHearYou</Text>
          <Text style={styles.subtitle}>hello, friend!</Text>
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

        <View style={styles.statusCard}>
          <Text style={styles.statusText}>{status}</Text>
        </View>

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

        <View style={styles.shortInstructions}>
          <Text style={styles.shortInstructionsText}>Say "Blue" or "Red" to change colors.</Text>
          <TouchableOpacity
            style={styles.smallResetButton}
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
            <Text style={styles.smallResetButtonText}>🔄</Text>
          </TouchableOpacity>
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
                🎤 Heard: "{recognizedText}"
              </Text>
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <View style={styles.testButtonsContainer}>
            <Text style={styles.testButtonsTitle}>Test Commands:</Text>
            <View style={styles.testButtonsRow}>
              <TouchableOpacity
                style={[styles.testButton, styles.blueButton]}
                onPress={testBlueCommand}
                activeOpacity={0.8}
              >
                <Text style={styles.testButtonText}>Test Blue</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.testButton, styles.redButton]}
                onPress={testRedCommand}
                activeOpacity={0.8}
              >
                <Text style={styles.testButtonText}>Test Red</Text>
              </TouchableOpacity>
            </View>
          </View>


        </View>
      </ScrollView>
    </View>
  );
}