import React from 'react';
import { ExtractedContent } from '../types';
import Skeleton from 'react-loading-skeleton';
import { FileText, FunctionSquare as Functions, GitBranch, AlertCircle } from 'lucide-react';

interface ContentDisplayProps {
  content: ExtractedContent | null;
  isLoading: boolean;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ content, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton height={32} width={200} />
        <Skeleton height={120} className="rounded-xl" />
        <Skeleton height={100} count={2} className="rounded-xl my-4" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <AlertCircle className="h-16 w-16 mb-4 text-gray-400 animate-float" />
        <p className="text-xl font-medium">No content extracted yet</p>
        <p className="text-gray-400 mt-2">Upload or capture an image to begin</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {content.text.length > 0 && (
        <div className="bg-white/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Text Content</h3>
          </div>
          <div className="space-y-4">
            {content.text.map((text, index) => (
              <p key={index} className="text-gray-700 leading-relaxed">
                {text}
              </p>
            ))}
          </div>
        </div>
      )}

      {content.equations.length > 0 && (
        <div className="bg-white/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Functions className="h-5 w-5 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Equations</h3>
          </div>
          <div className="grid gap-4">
            {content.equations.map((equation, index) => (
              <div 
                key={index} 
                className="bg-white p-4 rounded-lg font-mono text-sm hover:shadow-md transition-shadow duration-300"
              >
                {equation}
              </div>
            ))}
          </div>
        </div>
      )}

      {content.diagrams.length > 0 && (
        <div className="bg-white/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <GitBranch className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Diagrams</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.diagrams.map((diagram, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="aspect-video flex items-center justify-center bg-gray-50 rounded-lg p-4">
                  <div dangerouslySetInnerHTML={{ __html: diagram.svgContent }} />
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center font-medium capitalize">
                  {diagram.type}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};