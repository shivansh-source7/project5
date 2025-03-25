import React, { useState } from 'react';
import { ImageCapture } from './components/ImageCapture';
import { ContentDisplay } from './components/ContentDisplay';
import { extractContent, generateSlides } from './services/api';
import { ExtractedContent, ProcessingStatus } from './types';
import { Download, Loader2, Brain, FileText, PenTool, Sparkles } from 'lucide-react';

function App() {
  const [content, setContent] = useState<ExtractedContent | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>({ status: 'idle' });
  const [slideUrl, setSlideUrl] = useState<string | null>(null);

  const handleImageCapture = async (imageData: string) => {
    try {
      setStatus({ status: 'processing', message: 'Extracting content...' });
      const extractedContent = await extractContent(imageData);
      setContent(extractedContent);
      setStatus({ status: 'success' });
    } catch (error) {
      setStatus({ 
        status: 'error', 
        message: 'Failed to extract content. Please try again.' 
      });
    }
  };

  const handleGenerateSlides = async () => {
    if (!content) return;

    try {
      setStatus({ status: 'processing', message: 'Generating slides...' });
      const url = await generateSlides(content);
      setSlideUrl(url);
      setStatus({ status: 'success' });
    } catch (error) {
      setStatus({ 
        status: 'error', 
        message: 'Failed to generate slides. Please try again.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div 
        className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba')] bg-cover opacity-5 pointer-events-none"
        style={{ zIndex: -1 }}
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="animate-float">
              <Brain className="h-16 w-16 text-blue-500" />
            </div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Whiteboard Content Extractor
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your whiteboard content into digital format instantly. 
            Powered by AI to extract text, equations, and diagrams with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="glass-effect rounded-3xl shadow-xl p-8 transition-transform hover:scale-[1.02] duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl">
                <PenTool className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Capture Content</h2>
            </div>
            <ImageCapture onImageCapture={handleImageCapture} />
          </div>

          <div className="glass-effect rounded-3xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Extracted Content</h2>
            </div>
            {status.status === 'processing' ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                <p className="text-lg text-gray-600">{status.message}</p>
              </div>
            ) : status.status === 'error' ? (
              <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-xl">
                <p className="text-lg font-medium">{status.message}</p>
              </div>
            ) : (
              <ContentDisplay content={content} isLoading={status.status === 'processing'} />
            )}
          </div>
        </div>

        {content && (
          <div className="glass-effect rounded-3xl shadow-xl p-8 text-center max-w-2xl mx-auto">
            <button
              onClick={handleGenerateSlides}
              disabled={status.status === 'processing'}
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl text-lg font-medium hover:opacity-90 disabled:opacity-50 transition-all duration-300 hover:scale-105"
            >
              <Download className="h-6 w-6 group-hover:animate-bounce" />
              Generate Presentation
            </button>
            {slideUrl && (
              <a
                href={slideUrl}
                download="presentation.pptx"
                className="block mt-4 text-blue-500 hover:text-blue-600 font-medium text-lg hover:underline"
              >
                Download Your Presentation
              </a>
            )}
          </div>
        )}

        <footer className="mt-16 text-center">
          <div className="glass-effect rounded-full px-6 py-3 inline-block">
            <p className="text-gray-600">
              Powered by Advanced AI • Instant Digital Transformation
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;