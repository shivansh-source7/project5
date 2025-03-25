export interface ExtractedContent {
  text: string[];
  equations: string[];
  diagrams: DiagramData[];
}

export interface DiagramData {
  type: 'flowchart' | 'graph' | 'drawing';
  svgContent: string;
}

export interface ProcessingStatus {
  status: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
}