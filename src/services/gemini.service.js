const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config/environment");
const { ANALYZE_PRODUCT_SYSTEM_PROMPT } = require("../config/prompt");

class GeminiService {
  constructor() {
    if (!config.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is required in environment variables");
    }
    
    this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: ANALYZE_PRODUCT_SYSTEM_PROMPT
    });
  }

  async analyzeProductImages(imageUrls) {
    try {
      if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
        throw new Error("Image URLs array is required and must not be empty");
      }

      if (imageUrls.length > 5) {
        throw new Error("Maximum 5 images allowed per analysis");
      }

      // Prepare image parts for Gemini
      const imageParts = await Promise.all(
        imageUrls.map(async (url) => {
          try {
            // Fetch image from URL
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Failed to fetch image from ${url}`);
            }
            
            const arrayBuffer = await response.arrayBuffer();
            const mimeType = response.headers.get('content-type') || 'image/jpeg';
            
            return {
              inlineData: {
                data: Buffer.from(arrayBuffer).toString('base64'),
                mimeType: mimeType
              }
            };
          } catch (error) {
            throw new Error(`Error processing image ${url}: ${error.message}`);
          }
        })
      );

      // Create the prompt parts
      const promptParts = [
        "Analyze the provided fashion product image(s) and return the analysis in the specified JSON format.",
        ...imageParts
      ];

      // Generate content using Gemini
      const result = await this.model.generateContent(promptParts);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      try {
        // Extract JSON from response (in case it's wrapped in markdown)
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : text;
        
        const analysisResult = JSON.parse(jsonString);
        
        return {
          success: true,
          analysis: analysisResult,
          metadata: {
            imageCount: imageUrls.length,
            modelUsed: "gemini-1.5-flash",
            analysisTimestamp: new Date().toISOString()
          }
        };
      } catch (parseError) {
        throw new Error(`Failed to parse AI response as JSON: ${parseError.message}. Raw response: ${text}`);
      }

    } catch (error) {
      throw new Error(`Gemini analysis failed: ${error.message}`);
    }
  }

  async analyzeProductImagesSeparately(imageUrls) {
    try {
      if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
        throw new Error("Image URLs array is required and must not be empty");
      }

      if (imageUrls.length > 5) {
        throw new Error("Maximum 5 images allowed per analysis");
      }

      // Analyze each image separately
      const analyses = await Promise.all(
        imageUrls.map(async (url, index) => {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Failed to fetch image from ${url}`);
            }
            
            const arrayBuffer = await response.arrayBuffer();
            const mimeType = response.headers.get('content-type') || 'image/jpeg';
            
            const imagePart = {
              inlineData: {
                data: Buffer.from(arrayBuffer).toString('base64'),
                mimeType: mimeType
              }
            };

            const promptParts = [
              "Analyze this fashion product image and return the analysis in the specified JSON format.",
              imagePart
            ];

            const result = await this.model.generateContent(promptParts);
            const responseText = await result.response.text();

            // Parse JSON response
            const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/```\n([\s\S]*?)\n```/);
            const jsonString = jsonMatch ? jsonMatch[1] : responseText;
            const analysisResult = JSON.parse(jsonString);

            return {
              imageUrl: url,
              imageIndex: index,
              analysis: analysisResult,
              success: true
            };
          } catch (error) {
            return {
              imageUrl: url,
              imageIndex: index,
              error: error.message,
              success: false
            };
          }
        })
      );

      return {
        success: true,
        analyses: analyses,
        metadata: {
          imageCount: imageUrls.length,
          successfulAnalyses: analyses.filter(a => a.success).length,
          failedAnalyses: analyses.filter(a => !a.success).length,
          modelUsed: "gemini-1.5-flash",
          analysisTimestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      throw new Error(`Batch analysis failed: ${error.message}`);
    }
  }
}

module.exports = GeminiService;
