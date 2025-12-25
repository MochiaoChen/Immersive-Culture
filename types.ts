export interface SceneOption {
  id: string;
  name: string;
  shortDesc: string;
  description: string;
  promptModifier: string;
}

export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K',
}

declare global {
  // Define AIStudio interface to match the global type expected by the environment
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // Use the named AIStudio interface instead of an inline object type to avoid conflicts
    aistudio?: AIStudio;
  }
}