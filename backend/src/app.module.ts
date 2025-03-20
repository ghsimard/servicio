import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LocationsModule } from './locations/locations.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    PrismaModule,
    ServicesModule,
    AuthModule,
    DashboardModule,
    LocationsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
