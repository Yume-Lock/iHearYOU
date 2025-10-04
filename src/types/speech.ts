export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

export interface WebViewMessage {
  type: 'ready' | 'speechStart' | 'speechResult' | 'speechError' | 'speechEnd' | 'error';
  transcript?: string;
  confidence?: number;
  error?: string;
  message?: string;
}

export type SupportedColor = 'blue' | 'red';

export interface AppState {
  backgroundColor: string;
  status: string;
  currentColor: SupportedColor | '';
  isListening: boolean;
  recognizedText: string;
  hasReceivedResult: boolean;
}

export interface ColorCommand {
  color: SupportedColor;
  backgroundColor: string;
  message: string;
}