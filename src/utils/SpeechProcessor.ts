import { ColorCommand, SupportedColor } from '../types/speech';

/**
 * speech processing
 * handles speech recognition results and command processing
 */
export class SpeechProcessor {
  /**
   * color command mappings
   */
  private static readonly COLOR_COMMANDS: Record<SupportedColor, ColorCommand> = {
    blue: {
      color: 'blue',
      backgroundColor: '#2196F3',
      message: 'Here is the blue screen'
    },
    red: {
      color: 'red', 
      backgroundColor: '#F44336',
      message: 'Here is the red screen'
    }
  };

  /**
   * processes speech recognition result and determines if it's a valid color command
   * @param transcript - the recognized speech text
   * @returns ColorCommand if valid, null if invalid
   */
  static processCommand(transcript: string): ColorCommand | null {
    const cleanedTranscript = transcript.toLowerCase().trim();
    
    // check for exact matches first
    if (cleanedTranscript === 'blue') {
      return this.COLOR_COMMANDS.blue;
    }

    if (cleanedTranscript === 'red') {
      return this.COLOR_COMMANDS.red;
    }

    // check for partial matches (e.g., "um blue", "blue screen")
    if (cleanedTranscript.includes('blue')) {
      return this.COLOR_COMMANDS.blue;
    }

    if (cleanedTranscript.includes('red')) {
      return this.COLOR_COMMANDS.red;
    }
    
    return null;
  }

  /**
   * gets supported colors list
   * @returns array of supported color names
   */
  static getSupportedColors(): SupportedColor[] {
    return Object.keys(this.COLOR_COMMANDS) as SupportedColor[];
  }

  /**
   * checks if a color is supported
   * @param color - color to check
   * @returns boolean indicating if color is supported
   */
  static isColorSupported(color: string): color is SupportedColor {
    return color in this.COLOR_COMMANDS;
  }
}