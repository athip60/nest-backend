import { Controller, UseInterceptors } from '@nestjs/common/decorators/core';
import { Body, Param, Post, UploadedFile, UploadedFiles } from '@nestjs/common/decorators/http';
import { AuthService } from '../services/auth.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express/multer';
import { AuthReqeustDto } from '../dto/auth-request.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { BaseResponseObjectDto } from 'src/shared/dto/response.dto';

@Controller('api/auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('signin')
  async signin(@Body() request: AuthReqeustDto): Promise<AuthResponseDto> {
    return await this.authService.signin(request);
  }

  @Post('signup')
  @UseInterceptors(FileInterceptor('pictureProfile'))
  async signup(
    @Body() request: AuthReqeustDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AuthResponseDto> {
    return await this.authService.signup(request, file);
  }

  @Post('face-verify/:id')
  @UseInterceptors(FilesInterceptor('images', 2))
  async verifyFace(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<BaseResponseObjectDto> {
    return await this.authService.verifyFace(id, files);
  }
}