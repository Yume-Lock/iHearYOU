/**
 * speech recognition Service
 * handles webview-based speech recognition using web speech API
 */

export class SpeechRecognitionService {
  /**
   * generates the HTML content for webview speech recognition
   * @returns HTML string with embedded web Speech API func
   */
  static getWebViewHTML(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Speech Recognition</title>
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
                        // only process the final result
                        if (event.results.length > 0) {
                            const lastResult = event.results[event.results.length - 1];
                            if (lastResult.isFinal) {
                                const transcript = lastResult[0].transcript.toLowerCase().trim();
                                const confidence = lastResult[0].confidence || 0.5;
                                console.log('WebView: Final result:', transcript, 'confidence:', confidence);
                                
                                // small delay to ensure recognition has fully completed
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
                
                // stop any existing recognition first
                if (isRecognitionRunning) {
                    console.log('WebView: Stopping existing recognition first');
                    recognition.stop();
                    setTimeout(() => startSpeechRecognition(), 200);
                    return;
                }
                
                try {
                    console.log('WebView: Starting fresh speech recognition');
                    recognition.start();

                    // set timeout for auto-stop
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
            
            // initialize when page loads
            window.addEventListener('load', initSpeechRecognition);
            
            // also initialize immediately
            initSpeechRecognition();
        </script>
    </body>
    </html>`;
  }
}