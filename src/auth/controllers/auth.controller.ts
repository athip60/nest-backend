import { Controller, UseInterceptors } from "@nestjs/common/decorators/core";
import { Body, Post, UploadedFile } from "@nestjs/common/decorators/http";
import { AuthService } from "../services/auth.service";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { AuthReqeustDto } from "../dto/auth-request.dto";
import { AuthResponseDto } from "../dto/auth-response.dto";

@Controller('api/auth')
export class AuthController {
  constructor(readonly authService: AuthService) { }

  @Post('signin')
  async signin(
    @Body() request: AuthReqeustDto
  ): Promise<AuthResponseDto> {
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
}