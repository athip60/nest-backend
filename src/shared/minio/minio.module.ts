import { Module } from '@nestjs/common/decorators';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { MinioService } from './services/minio.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'NEST_MINIO_CONNECTION',
      useFactory: (configService: ConfigService) => {
        return new Client({
          endPoint: configService.get<string>('MINIO_ENDPOINT'),
          port: parseInt(configService.get<string>('MINIO_PORT') || '9000', 10),
          useSSL: configService.get<string>('MINIO_USE_SSL') === 'true',
          accessKey: configService.get<string>('MINIO_ACCESS_KEY'),
          secretKey: configService.get<string>('MINIO_SECRET_KEY'),
        });
      },
      inject: [ConfigService],
    },
    MinioService
  ],
  exports: ['NEST_MINIO_CONNECTION', MinioService],
})
export class MinioModule {}
