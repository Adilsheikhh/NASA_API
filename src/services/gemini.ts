import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { NASAImage, GPTExplanation } from '@/types';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async explainImage(image: NASAImage): Promise<GPTExplanation> {
    try {
      const prompt = `
        Analyze this NASA astronomy image and provide an enhanced explanation:
        
        Title: ${image.title}
        Original NASA Explanation: ${image.explanation}
        Date: ${image.date}
        
        Please provide:
        1. A simplified, engaging explanation suitable for general audiences
        2. Key features visible in the image
        3. Scientific context and significance
        
        Format your response as a JSON object with the following structure:
        {
          "explanation": "simplified explanation here",
          "keyFeatures": ["feature1", "feature2", "feature3"],
          "scientificContext": "broader scientific context here"
        }
        
        You are an expert astronomy educator who explains complex astronomical concepts in an accessible way. Always respond with valid JSON only, no additional text.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      if (!content) {
        throw new Error('No response from Gemini');
      }

      try {
        // Clean the response to extract JSON
        const cleanedContent = content.replace(/```json\n?|```\n?/g, '').trim();
        return JSON.parse(cleanedContent) as GPTExplanation;
      } catch {
        // Fallback if JSON parsing fails
        return {
          explanation: content,
          keyFeatures: ["Enhanced explanation generated"],
          scientificContext: "AI-generated astronomical analysis"
        };
      }
    } catch (error) {
      console.error('Error generating Gemini explanation:', error);
      throw new Error('Failed to generate enhanced explanation');
    }
  }

  async generateImageSummary(images: NASAImage[]): Promise<string> {
    try {
      const titles = images.map(img => img.title).join(', ');
      const prompt = `
        Create a brief summary of this collection of NASA astronomy images:
        Images: ${titles}
        
        Provide a 2-3 sentence overview highlighting the diversity and significance of these astronomical observations.
        
        You are an astronomy expert who creates engaging summaries of astronomical image collections. Respond with only the summary text, no additional formatting.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      return content || 'A fascinating collection of astronomical images from NASA.';
    } catch (error) {
      console.error('Error generating image summary:', error);
      throw new Error('Failed to generate image summary');
    }
  }
}
