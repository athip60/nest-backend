import { Injectable, Inject, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';
import { SignUrlResponseDto } from '../../dto/sign-url-response.dto';
import { UploadedObjectInfo } from 'minio/dist/main/internal/type';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly bucketName: string;

  constructor(
    @Inject('NEST_MINIO_CONNECTION') private readonly minioClient: Client,
    private readonly configService: ConfigService
  ) {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET_NAME');
  }
  async onModuleInit() {
    const exists = await this.minioClient.bucketExists(this.bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucketName, '');
    }
  }

  async upload(file: Express.Multer.File, objectName: string): Promise<UploadedObjectInfo> {
    if (!file.buffer || !file.size) {
      throw new HttpException('Invalid file data', HttpStatus.BAD_REQUEST);
    }
    return await this.minioClient.putObject(
      this.bucketName,
      objectName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype },
    );
  }

  async getSignedUrl(objectName: string): Promise<SignUrlResponseDto> {
    const signedUrl = await this.minioClient.presignedGetObject(
      this.bucketName,
      objectName,
      3600
    );
    return {
      url: signedUrl
    }
  }
}