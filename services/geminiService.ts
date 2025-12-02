import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Utility to resize and compress image before sending to API
// This prevents "Rpc failed due to xhr error" caused by large payloads
const resizeImage = (base64Str: string, maxWidth = 800): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth || height > maxWidth) {
        const ratio = maxWidth / Math.max(width, height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Compress to JPEG with 0.8 quality
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } else {
        resolve(base64Str); // Fallback if context fails
      }
    };
    img.onerror = () => resolve(base64Str); // Fallback if loading fails
  });
};

/**
 * Generates a styled image based on an input image and a specific prompt.
 * Uses gemini-2.5-flash-image (Nano Banana).
 */
export const generateStyledPhoto = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  try {
    // 1. Optimization: Resize image to reduce payload size and prevent 500/XHR errors
    const optimizedImage = await resizeImage(base64Image);

    // 2. Clean the base64 string
    const cleanBase64 = optimizedImage.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', 
              data: cleanBase64,
            },
          },
          {
            text: `${prompt} Keep the facial features resembling the original person but change the style, clothing, and background completely to match the description. High quality, detailed.`
          },
        ],
      },
      config: {
        // No responseMimeType for image generation models like this usually, 
        // relying on parsing the response parts.
      }
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};