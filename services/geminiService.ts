import { GoogleGenAI } from "@google/genai";
import { SceneOption, ImageSize } from '../types';

/**
 * Initializes the GenAI client.
 * IMPORTANT: Always creates a new instance to ensure the latest API key is used
 * if the user re-selects it via window.aistudio.
 */
const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found in environment.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateImmersiveImage = async (
  imageBase64: string,
  scene: SceneOption,
  size: ImageSize
): Promise<string> => {
  const ai = getAiClient();
  
  // Construct the prompt
  // Optimized for style consistency and natural integration
  const prompt = `
    You are a legendary master of Traditional Chinese Painting (Guohua). 
    
    Your task is to re-imagine the person from the input image as a character naturally living inside a specific traditional Chinese art masterpiece.

    **TARGET SCENE & STYLE:**
    ${scene.promptModifier}

    **STRICT GENERATION GUIDELINES:**
    1. **Complete Style Immersion**: The subject MUST NOT look like a photograph pasted onto a background. You must render the person using the EXACT same artistic medium as the scene (e.g., if the style is Ink Wash, use ink strokes and wash gradients for the face and clothes; if it is a Mural, apply mineral pigment textures and weathering effects).
    2. **Period-Accurate Clothing**: Completely ignore the user's modern clothes. Dress the subject in exquisite, historically accurate Hanfu or attire that fits the scene's dynasty (e.g., Song Dynasty scholar robes, Tang Dynasty court dress). The fabric folds and textures must match the painting style.
    3. **Natural Composition**: Ensure the subject interacts naturally with the environment (e.g., standing firmly on the ground, sitting in a boat, leaning on a railing). Match the lighting, shadows, and color temperature of the subject to the background perfectly.
    4. **Identity Preservation**: Retain the user's key facial features so they are recognizable, but stylize the face (shading, outlines) to blend seamlessly into the artwork.
    
    Output a single, cohesive, high-quality image that looks like an authentic piece of traditional art.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg/png, API handles standard types
              data: imageBase64,
            },
          },
        ],
      },
      config: {
        imageConfig: {
          imageSize: size, // 1K, 2K, or 4K
          aspectRatio: '3:4', // Portrait orientation usually fits people better in these scenes
        },
        // We do NOT use googleSearch here as it's primarily a style transfer/creative generation task
        // based on the uploaded image, not a factual search query.
      },
    });

    // Parse response
    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
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