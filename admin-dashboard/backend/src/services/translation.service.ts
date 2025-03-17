import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { GoogleTranslateService } from '../utils/googleTranslate';

interface ServiceToTranslate {
  service_id: string;
  name_en: string;
  name_fr: string | null;
  name_es: string | null;
}

export interface TranslationJob {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  totalServices: number;
  completedServices: number;
  errors: string[];
}

@Injectable()
export class TranslationService {
  private activeJobs: Map<string, TranslationJob> = new Map();

  constructor(
    private prisma: PrismaService,
    private googleTranslate: GoogleTranslateService,
  ) {}

  async startTranslation(targetLanguage: 'fr' | 'es'): Promise<TranslationJob> {
    const jobId = Date.now().toString();
    const services = await this.prisma.service.findMany({
      where: {
        translations: {
          none: {
            language: targetLanguage,
          },
        },
      },
    });

    // Check if there are any services to translate
    if (!services || services.length === 0) {
      const job: TranslationJob = {
        id: jobId,
        status: 'error',
        totalServices: 0,
        completedServices: 0,
        errors: ['No services found to translate. Either all services are already translated or no services exist in the database.'],
      };
      this.activeJobs.set(jobId, job);
      return job;
    }

    const job: TranslationJob = {
      id: jobId,
      status: 'pending',
      totalServices: services.length,
      completedServices: 0,
      errors: [],
    };

    this.activeJobs.set(jobId, job);

    // Start translation process in background
    this.processTranslation(jobId, services, targetLanguage);

    return job;
  }

  private async processTranslation(
    jobId: string,
    services: any[],
    targetLanguage: 'fr' | 'es',
  ): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (!job) return;

    job.status = 'in_progress';
    
    try {
      // Check if there are any services to translate
      if (!services || services.length === 0) {
        job.status = 'error';
        job.errors.push('No services to translate');
        this.activeJobs.set(jobId, job);
        return;
      }

      const serviceNames = services.map(s => s.name);
      
      // Check if all service names are valid
      if (serviceNames.some(name => !name || name.trim() === '')) {
        job.status = 'error';
        job.errors.push('Some services have invalid or empty names');
        this.activeJobs.set(jobId, job);
        return;
      }

      const translations = await this.googleTranslate.batchTranslate(
        serviceNames,
        targetLanguage,
      );

      // Update translations in database
      for (let i = 0; i < services.length; i++) {
        try {
          await this.prisma.translation.create({
            data: {
              serviceId: services[i].id,
              language: targetLanguage,
              translatedName: translations[i],
            },
          });
          
          job.completedServices++;
          this.activeJobs.set(jobId, job);
        } catch (error) {
          job.errors.push(`Failed to save translation for service ${services[i].name}: ${error.message}`);
        }
      }

      job.status = job.errors.length > 0 ? 'error' : 'completed';
    } catch (error) {
      job.status = 'error';
      job.errors.push(`Translation process failed: ${error.message}`);
    }

    this.activeJobs.set(jobId, job);

    // Clean up job after 1 hour
    setTimeout(() => {
      this.activeJobs.delete(jobId);
    }, 3600000);
  }

  getJobStatus(jobId: string): TranslationJob | null {
    return this.activeJobs.get(jobId) || null;
  }

  cancelJob(jobId: string): boolean {
    return this.activeJobs.delete(jobId);
  }

  async translateExistingServices(): Promise<TranslationJob> {
    const jobId = Date.now().toString();
    
    try {
      // Get all services from servicioadmin_dev that need translation
      const services = await this.prisma.$queryRaw<ServiceToTranslate[]>`
        SELECT service_id, name_en, name_fr, name_es
        FROM services 
        WHERE name_en IS NOT NULL AND (name_fr IS NULL OR name_es IS NULL)
      `;

      if (!services || services.length === 0) {
        return {
          id: jobId,
          status: 'error',
          totalServices: 0,
          completedServices: 0,
          errors: ['No services found that need translation']
        };
      }

      const job: TranslationJob = {
        id: jobId,
        status: 'in_progress',
        totalServices: services.length * 2, // Each service needs FR and ES translations
        completedServices: 0,
        errors: []
      };

      this.activeJobs.set(jobId, job);

      // Translate each service to French and Spanish
      for (const service of services) {
        try {
          // Translate to French if needed
          if (!service.name_fr) {
            const frTranslation = await this.googleTranslate.translateText({
              text: service.name_en,
              targetLanguage: 'fr'
            });

            // Update French translation
            await this.prisma.$executeRaw`
              UPDATE services 
              SET name_fr = ${frTranslation}
              WHERE service_id = ${service.service_id}::uuid
            `;
            
            job.completedServices++;
            this.activeJobs.set(jobId, job);
          }

          // Translate to Spanish if needed
          if (!service.name_es) {
            const esTranslation = await this.googleTranslate.translateText({
              text: service.name_en,
              targetLanguage: 'es'
            });

            // Update Spanish translation
            await this.prisma.$executeRaw`
              UPDATE services 
              SET name_es = ${esTranslation}
              WHERE service_id = ${service.service_id}::uuid
            `;
            
            job.completedServices++;
            this.activeJobs.set(jobId, job);
          }
        } catch (error) {
          job.errors.push(`Failed to translate service ${service.name_en}: ${error.message}`);
        }
      }

      job.status = job.errors.length > 0 ? 'error' : 'completed';
      this.activeJobs.set(jobId, job);
      return job;
    } catch (error) {
      return {
        id: jobId,
        status: 'error',
        totalServices: 0,
        completedServices: 0,
        errors: [`Failed to process translations: ${error.message}`]
      };
    }
  }
} 