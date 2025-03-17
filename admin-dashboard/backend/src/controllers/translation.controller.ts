import { Controller, Post, Get, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { TranslationService, TranslationJob } from '../services/translation.service';

interface StartTranslationDto {
  targetLanguage: 'fr' | 'es';
}

@Controller('api/translation')
export class TranslationController {
  constructor(private translationService: TranslationService) {}

  @Post('start')
  async startTranslation(@Body() body: StartTranslationDto): Promise<TranslationJob> {
    try {
      return await this.translationService.startTranslation(body.targetLanguage);
    } catch (error) {
      throw new HttpException(
        `Failed to start translation: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('translate-existing')
  async translateExistingServices(): Promise<TranslationJob> {
    try {
      return await this.translationService.translateExistingServices();
    } catch (error) {
      throw new HttpException(
        `Failed to translate existing services: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('status/:jobId')
  getTranslationStatus(@Param('jobId') jobId: string): TranslationJob {
    const job = this.translationService.getJobStatus(jobId);
    if (!job) {
      throw new HttpException('Translation job not found', HttpStatus.NOT_FOUND);
    }
    return job;
  }

  @Post('cancel/:jobId')
  cancelTranslation(@Param('jobId') jobId: string): { success: boolean } {
    const success = this.translationService.cancelJob(jobId);
    if (!success) {
      throw new HttpException('Translation job not found', HttpStatus.NOT_FOUND);
    }
    return { success };
  }
} 