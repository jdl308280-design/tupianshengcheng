import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  isProcessing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file (JPEG, PNG).");
      return;
    }

    // Limit size if needed, though gemini handles decent sizes. 
    // Let's keep it simple but safe with a 10MB soft limit warning if implemented.
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onImageSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <label 
        htmlFor="file-upload"
        className={`
          relative flex flex-col items-center justify-center w-full h-64 
          rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
          overflow-hidden group
          ${dragActive 
            ? 'border-indigo-500 bg-indigo-500/10' 
            : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-800/50'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          {isProcessing ? (
            <>
               <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mb-4" />
               <p className="text-lg font-medium text-zinc-300">Processing Photo...</p>
               <p className="text-sm text-zinc-500 mt-2">Preparing your studio session</p>
            </>
          ) : (
            <>
              <div className={`p-4 rounded-full mb-4 transition-colors ${dragActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-200'}`}>
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="mb-2 text-lg font-medium text-zinc-200">
                <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-zinc-500">
                Upload a clear selfie or portrait (JPEG, PNG)
              </p>
            </>
          )}
        </div>
        
        <input 
          id="file-upload" 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleChange}
          disabled={isProcessing}
        />
      </label>
    </div>
  );
};
