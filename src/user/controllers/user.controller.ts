import { UserResponseDto } from '../dto/user-response.dto';
import { UserRequestDto } from '../dto/user-request.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
  Req
} from '@nestjs/common/decorators';
import { UserService } from '../services/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseResponseObjectDto } from 'src/shared/dto/response.dto';

@Controller('api/user')
export class UserController {
  constructor(readonly userService: UserService) {}

  @Get('me')
  async getUserById(
    @Req() req: Request
  ): Promise<UserResponseDto> {
    return await this.userService.getUserById(req);
  }

  @Patch('me')
  @UseInterceptors(FileInterceptor('file'))
  async updateUser(
    @Req() req: Request,
    @Body() request: Partial<UserRequestDto>,
    @UploadedFile() pictureProfile: Express.Multer.File,
  ): Promise<BaseResponseObjectDto> {
    return await this.userService.updateUser(req, request, pictureProfile);
  }

  @Delete('me')
  async hardDeleteUser(
    @Req() req: Request
  ): Promise<BaseResponseObjectDto> {
    return await this.userService.hardDeleteUser(req);
  }
}
