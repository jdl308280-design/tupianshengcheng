export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface StyleConfig {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface GeneratedImage {
  id: string; // correlates to StyleConfig.id
  status: GenerationStatus;
  imageUrl?: string;
  error?: string;
}
