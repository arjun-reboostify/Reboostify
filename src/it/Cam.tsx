import React, { useEffect, useRef, useState } from 'react';
import { Camera, XCircle, Camera as CameraIcon, Download, Trash } from 'lucide-react';

interface CapturedImage {
  id: string;
  data: string;
  timestamp: string;
}

const WebcamDisplay = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>('');
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const startWebcam = async () => {
    try {
      // Request maximum resolution
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 4096 },
          height: { ideal: 2160 },
          facingMode: 'user'
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError('');
      }
    } catch (err) {
      setError('Failed to access webcam. Please ensure you have granted camera permissions.');
      console.error('Error accessing webcam:', err);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64
      const imageData = canvas.toDataURL('image/png');
      
      // Create new image object
      const newImage: CapturedImage = {
        id: Date.now().toString(),
        data: imageData,
        timestamp: new Date().toLocaleString()
      };
      
      // Update state and local storage
      setCapturedImages(prev => {
        const updated = [newImage, ...prev];
        localStorage.setItem('capturedImages', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const deleteImage = (id: string) => {
    setCapturedImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      localStorage.setItem('capturedImages', JSON.stringify(updated));
      return updated;
    });
    setSelectedImage(null);
  };

  const downloadImage = (imageData: string) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `webcam-capture-${Date.now()}.png`;
    link.click();
  };

  useEffect(() => {
    // Load saved images from localStorage
    const savedImages = localStorage.getItem('capturedImages');
    if (savedImages) {
      setCapturedImages(JSON.parse(savedImages));
    }

    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-gray-50 min-h-screen w-full">
      <div className="w-full max-w-4xl space-y-6">
        {/* Main webcam display */}
        <div className="relative rounded-xl bg-white shadow-xl overflow-hidden">
          {error && (
            <div className="absolute top-0 left-0 right-0 bg-red-100 p-4 text-red-700 z-10">
              {error}
            </div>
          )}
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
          
          <div className="absolute bottom-4 right-4 flex space-x-3">
            {isStreaming && (
              <button
                onClick={captureImage}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg"
              >
                <CameraIcon size={20} />
                <span>Capture</span>
              </button>
            )}
            
            {!isStreaming ? (
              <button
                onClick={startWebcam}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg"
              >
                <Camera size={20} />
                <span>Start Camera</span>
              </button>
            ) : (
              <button
                onClick={stopWebcam}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg"
              >
                <XCircle size={20} />
                <span>Stop Camera</span>
              </button>
            )}
          </div>
        </div>

        {/* Hidden canvas for capturing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Gallery section */}
        {capturedImages.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Captured Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {capturedImages.map((img) => (
                <div 
                  key={img.id}
                  className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <img 
                    src={img.data} 
                    alt={`Captured at ${img.timestamp}`}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => setSelectedImage(img.data)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                    <button
                      onClick={() => downloadImage(img.data)}
                      className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                    >
                      <Download size={20} className="text-white" />
                    </button>
                    <button
                      onClick={() => deleteImage(img.id)}
                      className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash size={20} className="text-white" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2">
                    {img.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image preview modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-4xl max-h-[90vh] overflow-auto">
              <img 
                src={selectedImage} 
                alt="Preview" 
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamDisplay;