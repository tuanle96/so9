import '../../boilerplate.polyfill';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { HealthCheckerModule } from '../health-checker/health-checker.module';
import { UsersModule } from '../users/users.module';
import { providers } from './app.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    HealthCheckerModule,
  ],
  providers,
  exports: [DatabaseModule],
})
export class MainAppModule {}
