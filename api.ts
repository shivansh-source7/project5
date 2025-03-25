import axios from 'axios';
import { ExtractedContent } from '../types';

const API_URL = 'http://localhost:8000';

export const extractContent = async (imageData: string): Promise<ExtractedContent> => {
  const response = await axios.post(`${API_URL}/extract`, { image: imageData });
  return response.data;
};

export const generateSlides = async (content: ExtractedContent): Promise<string> => {
  const response = await axios.post(`${API_URL}/generate-slides`, content, {
    responseType: 'blob'
  });
  return URL.createObjectURL(response.data);
};