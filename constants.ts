import { StyleConfig } from './types';

export const PHOTO_STYLES: StyleConfig[] = [
  {
    id: 'professional',
    name: '职业肖像照',
    description: 'Professional Headshot',
    prompt: 'Transform this person into a high-end professional LinkedIn headshot. Wear a sharp business suit. Neutral, soft gradient studio background. Professional lighting, confident expression, sharp focus on eyes, 8k resolution, photorealistic.'
  },
  {
    id: 'fashion',
    name: '时尚写真',
    description: 'High Fashion',
    prompt: 'High fashion editorial photography of this person. Vogue style. Avant-garde outfit, dramatic posing, bold makeup. Studio lighting with strong contrast. Stylish, trendy, chic aesthetic.'
  },
  {
    id: 'museum',
    name: '美术馆迷失的她',
    description: 'Lost in the Gallery',
    prompt: 'Candid artistic shot of this person wandering in a modern art gallery. Soft, dreamy bokeh background of abstract paintings. Emotional, mysterious atmosphere, "lost in the museum" vibe. Soft diffused lighting, contemplative expression.'
  },
  {
    id: 'bw_art',
    name: '黑白艺术照',
    description: 'B&W Fine Art',
    prompt: 'Fine art black and white photography. High contrast, dramatic shadows, Rembrandt lighting. Soulful, intense expression. Grainy film texture, classic and timeless portraiture.'
  },
  {
    id: 'magazine',
    name: '美式杂志封面',
    description: 'American Magazine',
    prompt: 'American lifestyle magazine cover style. Bright, vibrant colors, pop culture aesthetic. Retro 90s vibe, confident smile, energetic composition. Sunlight, outdoor city setting, commercial photography look.'
  },
  {
    id: 'cinematic',
    name: '电影肖像',
    description: 'Cinematic Portrait',
    prompt: 'Cinematic movie scene close-up. Teal and orange color grading. Shallow depth of field, anamorphic lens flare. Atmospheric lighting, narrative-driven mood, like a screenshot from a high-budget drama film.'
  }
];