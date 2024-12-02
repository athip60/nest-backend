import { Module } from "@nestjs/common/decorators/modules";
import { PrismaService } from "@prisma/prisma.service";
import { MinioModule } from "src/shared/minio/minio.module";
import { FileService } from "./services/file.service";

@Module({
  providers: [FileService ,PrismaService],
  imports: [MinioModule],
  exports: [FileService]
})
export class FileModule { }
