import React from 'react';
import { GeneratedImage, GenerationStatus, StyleConfig } from '../types';
import { Download, AlertCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface PhotoCardProps {
  styleConfig: StyleConfig;
  data: GeneratedImage;
  onRetry: (id: string) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ styleConfig, data, onRetry }) => {
  const handleDownload = () => {
    if (data.imageUrl) {
      const link = document.createElement('a');
      link.href = data.imageUrl;
      link.download = `portrait-${styleConfig.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl aspect-[3/4]">
      
      {/* Background / Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {data.status === GenerationStatus.IDLE && (
           <div className="flex flex-col items-center text-zinc-600">
             <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
             <span className="text-sm">Waiting for upload...</span>
           </div>
        )}

        {data.status === GenerationStatus.LOADING && (
          <div className="flex flex-col items-center justify-center space-y-3">
             <div className="relative w-12 h-12">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-zinc-700 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
             </div>
             <p className="text-xs text-indigo-400 font-medium tracking-wider animate-pulse">GENERATING...</p>
          </div>
        )}

        {data.status === GenerationStatus.ERROR && (
          <div className="flex flex-col items-center justify-center px-4 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm text-zinc-400 mb-3">Generation failed</p>
            <button 
              onClick={() => onRetry(styleConfig.id)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}

        {data.status === GenerationStatus.SUCCESS && data.imageUrl && (
          <img 
            src={data.imageUrl} 
            alt={styleConfig.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </div>

      {/* Overlay Info (Always visible or on hover) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="serif text-lg text-white font-medium drop-shadow-md">{styleConfig.name}</h3>
        <p className="text-xs text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity delay-75 duration-300 line-clamp-1">{styleConfig.description}</p>
        
        {data.status === GenerationStatus.SUCCESS && (
          <button 
            onClick={handleDownload}
            className="mt-3 flex w-full items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs py-2 rounded-lg transition-all border border-white/10"
          >
            <Download className="w-3 h-3" />
            Save Photo
          </button>
        )}
      </div>
    </div>
  );
};
