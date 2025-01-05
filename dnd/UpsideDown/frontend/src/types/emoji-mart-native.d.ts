declare module 'emoji-mart-native' {
  export interface EmojiPickerProps {
    onEmojiSelected: (emoji: { native: string }) => void;
    columns?: number;
  }

  export const EmojiPicker: React.FC<EmojiPickerProps>;
} 