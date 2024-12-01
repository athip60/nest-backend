import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '@prisma/prisma.service';
import { UploadFileResponseDto } from '../../shared/dto/upload-file-response.dto';
import { MinioService } from 'src/shared/minio/services/minio.service';
import { generateObject } from 'src/shared/utils/minio.utils';
import { GenerateObjectDto } from 'src/shared/dto/generate-object.dto';
import { SignUrlResponseDto } from 'src/shared/dto/sign-url-response.dto';
import { validateFilePicture } from 'src/shared/utils/validation.utils';

@Injectable()
export class FileService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly minioService: MinioService
  ) { }

  async uploadPicture(file: Express.Multer.File): Promise<UploadFileResponseDto> {
    validateFilePicture(file);
    const resGenerate: GenerateObjectDto = generateObject(file)
    await this.minioService.upload(file, resGenerate.objectName);
    const responsePicture = await this.prismaService.pictures.create({
      data: {
        path: `${resGenerate.year}/${resGenerate.month}/${resGenerate.day}`,
        key: resGenerate.key,
        type: file.mimetype.split('/')[1],
      },
    });

    return {
      pictureId: responsePicture.id,
    };
  }

  async getSignedUrl(objectName: string): Promise<SignUrlResponseDto> {
    return await this.minioService.getSignedUrl(objectName);
  }
}