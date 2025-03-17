import { TranslationServiceClient } from '@google-cloud/translate';
import { config } from 'dotenv';

config();

interface TranslationRequest {
  text: string;
  targetLanguage: 'fr' | 'es';
}

export class GoogleTranslateService {
  private client: TranslationServiceClient;
  private projectId: string;

  constructor() {
    if (!process.env.GOOGLE_CLOUD_PROJECT_ID || !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error('Missing Google Cloud credentials');
    }

    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    this.client = new TranslationServiceClient();
  }

  async translateText(request: TranslationRequest): Promise<string> {
    try {
      const [response] = await this.client.translateText({
        parent: `projects/${this.projectId}/locations/global`,
        contents: [request.text],
        mimeType: 'text/plain',
        sourceLanguageCode: 'en',
        targetLanguageCode: request.targetLanguage,
      });

      if (!response.translations?.[0]?.translatedText) {
        throw new Error('No translation returned');
      }

      return response.translations[0].translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async batchTranslate(texts: string[], targetLanguage: 'fr' | 'es'): Promise<string[]> {
    try {
      const [response] = await this.client.translateText({
        parent: `projects/${this.projectId}/locations/global`,
        contents: texts,
        mimeType: 'text/plain',
        sourceLanguageCode: 'en',
        targetLanguageCode: targetLanguage,
      });

      if (!response.translations || response.translations.length !== texts.length) {
        throw new Error('Invalid translation response');
      }

      return response.translations.map(t => t.translatedText || '');
    } catch (error) {
      console.error('Batch translation error:', error);
      throw new Error(`Batch translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 