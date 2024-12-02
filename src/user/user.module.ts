import { Module } from "@nestjs/common/decorators/modules";
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PrismaService } from "@prisma/prisma.service";
import { FileModule } from "src/file/file.module";
import { MinioModule } from "src/shared/minio/minio.module";

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  imports: [FileModule, MinioModule]
})
export class UserModule {}
