import React, { useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, X, Image as ImageIcon, RefreshCw } from 'lucide-react';

interface ImageCaptureProps {
  onImageCapture: (imageData: string) => void;
}

export const ImageCapture: React.FC<ImageCaptureProps> = ({ onImageCapture }) => {
  const [showWebcam, setShowWebcam] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const webcamRef = React.useRef<Webcam>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      onImageCapture(result);
    };
    reader.readAsDataURL(file);
  }, [onImageCapture]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreview(imageSrc);
      onImageCapture(imageSrc);
      setShowWebcam(false);
    }
  }, [onImageCapture]);

  const resetCapture = () => {
    setPreview(null);
    setShowWebcam(false);
  };

  if (preview) {
    return (
      <div className="relative group">
        <img 
          src={preview} 
          alt="Captured" 
          className="w-full rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]" 
        />
        <button
          onClick={resetCapture}
          className="absolute top-4 right-4 bg-white/90 rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 group-hover:scale-110"
        >
          <RefreshCw className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showWebcam ? (
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 space-x-4">
              <button
                onClick={captureImage}
                className="bg-white text-gray-900 px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg hover:scale-105 transform duration-300"
              >
                Capture Image
              </button>
              <button
                onClick={() => setShowWebcam(false)}
                className="bg-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-colors shadow-lg hover:scale-105 transform duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer group
              ${isDragActive 
                ? 'border-blue-500 bg-blue-50/50 scale-105' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/50 animate-pulse-border'}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-blue-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <ImageIcon className="h-10 w-10 text-blue-500" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">
                  {isDragActive ? 'Drop your image here' : 'Drop your image here, or click to select'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports PNG, JPG up to 10MB
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowWebcam(true)}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-gray-700 px-6 py-4 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 hover:scale-[1.02] group"
          >
            <Camera className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
            Use Webcam
          </button>
        </div>
      )}
    </div>
  );
};