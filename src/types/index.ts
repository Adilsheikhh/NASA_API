// NASA APOD API Response Types
export interface NASAImage {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version: string;
  title: string;
  url: string;
  copyright?: string;
}

// AI Explanation Response
export interface GPTExplanation {
  explanation: string;
  keyFeatures: string[];
  scientificContext: string;
}

// Component Props
export interface ImageCardProps {
  image: NASAImage;
  gptExplanation?: GPTExplanation;
  onExplainClick: (image: NASAImage) => void;
  isLoading?: boolean;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
