import React, { useState } from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { PHOTO_STYLES } from './constants';
import { GeneratedImage, GenerationStatus } from './types';
import { generateStyledPhoto } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { PhotoCard } from './components/PhotoCard';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>(
    PHOTO_STYLES.map(style => ({
      id: style.id,
      status: GenerationStatus.IDLE
    }))
  );

  const startGeneration = async (base64Image: string) => {
    setOriginalImage(base64Image);
    
    // Reset states to loading
    setGeneratedImages(prev => prev.map(img => ({
      ...img,
      status: GenerationStatus.LOADING,
      error: undefined,
      imageUrl: undefined
    })));

    // Queue system to limit concurrency to 2 parallel requests
    // This prevents "Rpc failed" errors caused by flooding the network with 6 large requests
    const queue = [...PHOTO_STYLES];
    const concurrency = 2;

    const processQueue = async () => {
      while (queue.length > 0) {
        const style = queue.shift();
        if (style) {
          await generateSingleStyle(style.id, base64Image, style.prompt);
        }
      }
    };

    // Create workers
    const workers = Array(concurrency).fill(null).map(() => processQueue());
    
    // Wait for all to finish (optional, but good for cleanup logic if needed)
    await Promise.all(workers);
  };

  const generateSingleStyle = async (id: string, base64Image: string, prompt: string) => {
    try {
      const resultImage = await generateStyledPhoto(base64Image, prompt);
      
      setGeneratedImages(prev => prev.map(img => 
        img.id === id 
          ? { ...img, status: GenerationStatus.SUCCESS, imageUrl: resultImage } 
          : img
      ));
    } catch (error) {
      console.error(`Failed to generate ${id}`, error);
      setGeneratedImages(prev => prev.map(img => 
        img.id === id 
          ? { ...img, status: GenerationStatus.ERROR, error: 'Failed to generate' } 
          : img
      ));
    }
  };

  const handleRetry = (id: string) => {
    if (!originalImage) return;
    
    const style = PHOTO_STYLES.find(s => s.id === id);
    if (!style) return;

    setGeneratedImages(prev => prev.map(img => 
      img.id === id 
        ? { ...img, status: GenerationStatus.LOADING, error: undefined } 
        : img
    ));

    generateSingleStyle(id, originalImage, style.prompt);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20 selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight serif">AI Photo Studio</h1>
          </div>
          {originalImage && (
            <button 
              onClick={() => {
                setOriginalImage(null);
                setGeneratedImages(PHOTO_STYLES.map(s => ({ id: s.id, status: GenerationStatus.IDLE })));
              }}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              New Session
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 pt-10">
        
        {/* Intro / Upload Section */}
        <div className={`transition-all duration-500 ease-in-out ${originalImage ? 'mb-12' : 'min-h-[70vh] flex flex-col justify-center'}`}>
          <div className="text-center mb-10 max-w-2xl mx-auto">
            {!originalImage && (
              <>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-6">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium text-zinc-300">Powered by Gemini Nano Banana</span>
                </div>
                <h2 className="serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Your Personal AI <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    Portrait Studio
                  </span>
                </h2>
                <p className="text-zinc-400 text-lg mb-8">
                  Upload a single photo and instantly receive 6 professional, artistic interpretations ranging from high fashion to cinematic styles.
                </p>
              </>
            )}
            
            {!originalImage ? (
              <ImageUploader 
                onImageSelected={startGeneration} 
                isProcessing={false} 
              />
            ) : (
              <div className="flex items-center justify-center gap-6 animate-fade-in">
                <div className="relative">
                   <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-30 blur-lg"></div>
                   <img 
                     src={originalImage} 
                     alt="Original" 
                     className="relative w-24 h-24 rounded-full object-cover border-2 border-zinc-700 shadow-xl" 
                   />
                   <div className="absolute bottom-0 right-0 bg-zinc-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-zinc-700">ORIGINAL</div>
                </div>
                <div className="h-px w-24 bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800"></div>
                <div className="text-left">
                   <h3 className="serif text-2xl text-white">Generation in Progress</h3>
                   <p className="text-zinc-400 text-sm">Creating your portfolio...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {originalImage && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-20">
            {PHOTO_STYLES.map((style) => (
              <PhotoCard
                key={style.id}
                styleConfig={style}
                data={generatedImages.find(img => img.id === style.id)!}
                onRetry={handleRetry}
              />
            ))}
          </div>
        )}
      </main>

      <style>{`
        .serif {
          font-family: 'Playfair Display', serif;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;