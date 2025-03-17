import { Module } from '@nestjs/common';
import { TranslationController } from './controllers/translation.controller';
import { ServiceController } from './controllers/service.controller';
import { TranslationService } from './services/translation.service';
import { PrismaService } from './services/prisma.service';
import { GoogleTranslateService } from './utils/googleTranslate';

@Module({
  imports: [],
  controllers: [TranslationController, ServiceController],
  providers: [TranslationService, PrismaService, GoogleTranslateService],
})
export class AppModule {} 