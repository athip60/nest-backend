import { Module } from '@nestjs/common/decorators/modules';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { RequestMethod } from '@nestjs/common/enums';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './shared/middleware/auth.middleware';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from '@prisma/prisma.service';
import { HttpExceptionFilter } from '@middleware/http-error.middleware';
import { MinioModule } from './shared/minio/minio.module';
import { FileModule } from './file/file.module';
import { ExternalModule } from './external/external.module';

@Module({
  imports: [UserModule, AuthModule, MinioModule, FileModule, ExternalModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: 'APP_FILTER',
      useClass: HttpExceptionFilter,
    }
  ],
  exports: [PrismaService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'api/auth/signin', method: RequestMethod.POST },
        { path: 'api/auth/signup', method: RequestMethod.POST },
      )
      .forRoutes({ path: 'api/*', method: RequestMethod.ALL });
  }
}