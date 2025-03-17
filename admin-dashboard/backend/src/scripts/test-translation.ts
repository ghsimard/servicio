import { GoogleTranslateService } from '../utils/googleTranslate';
import { config } from 'dotenv';

config();

async function testTranslation() {
  try {
    const translator = new GoogleTranslateService();
    const testText = 'House Cleaning';
    
    console.log('Testing French translation...');
    const frResult = await translator.translateText({
      text: testText,
      targetLanguage: 'fr'
    });
    console.log(`Original: ${testText}`);
    console.log(`French: ${frResult}`);

    console.log('\nTesting Spanish translation...');
    const esResult = await translator.translateText({
      text: testText,
      targetLanguage: 'es'
    });
    console.log(`Original: ${testText}`);
    console.log(`Spanish: ${esResult}`);

    console.log('\n✅ Translation service is working correctly!');
  } catch (error) {
    console.error('\n❌ Translation test failed:', error);
    if (error.message.includes('credentials')) {
      console.error('\nPossible issues:');
      console.error('1. Make sure your credentials file is in the correct location');
      console.error('2. Check that GOOGLE_CLOUD_PROJECT_ID in .env matches your project');
      console.error('3. Verify that the Cloud Translation API is enabled in your project');
    }
  }
}

testTranslation(); 