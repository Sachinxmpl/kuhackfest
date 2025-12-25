import OpenAI from 'openai';
import similarity from 'compute-cosine-similarity';

// Initialize OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export const aiService = {
 
  async getEmbedding(text: string): Promise<number[] | null> {
    // Remove newlines to ensure better vectorization
    const cleanText = text.replace(/\n/g, ' ');

    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: cleanText,
      });

      if (!response.data || response.data.length === 0) {
        return null;
      }

      return response.data[0]?.embedding || [];
    } catch (error) {
      console.error("Error generating embedding:", error);
      return null;
    }
  },

  calculateScore(vecA: number[], vecB: number[]): number {
    return similarity(vecA, vecB) || 0;
  }
};