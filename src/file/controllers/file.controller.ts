import { Controller, UseInterceptors } from "@nestjs/common/decorators/core";
import { Get, Post, Query, UploadedFile } from "@nestjs/common/decorators/http";
import { FileService } from "../services/file.service";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { UploadFileResponseDto } from "../../shared/dto/upload-file-response.dto";
import { SignUrlResponseDto } from "src/shared/dto/sign-url-response.dto";

@Controller('api/file')
export class FileController {
  constructor(readonly fileService: FileService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File
  ): Promise<UploadFileResponseDto> {
    return await this.fileService.uploadPicture(file);
  }

  @Get('sign-url')
  async viewFile(@Query('key') key: string): Promise<SignUrlResponseDto> {
    return await this.fileService.getSignedUrl(key);
  }
}