import { Injectable } from '@nestjs/common/decorators';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { AuthReqeustDto } from '../dto/auth-request.dto';
import { PrismaService } from '@prisma/prisma.service';
import { FileService } from 'src/file/services/file.service';
import {
  validateFilePicture,
  validateRequest,
} from 'src/shared/utils/validation.utils';
import { UploadFileResponseDto } from 'src/shared/dto/upload-file-response.dto';
import { hashPassword, verifyPassword } from 'src/shared/utils/hash.utlis';
import { generateToken } from 'src/shared/utils/jwt.utils';
import { HttpException, UnauthorizedException } from '@nestjs/common/exceptions';
import { ExternalService } from 'src/external/service/external.service';
import { BaseResponseObjectDto } from 'src/shared/dto/response.dto';
import { HttpStatus } from '@nestjs/common/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
    private readonly externalService: ExternalService,
  ) {}

  async signin(request: AuthReqeustDto): Promise<AuthResponseDto> {
    validateRequest(request, ['username', 'password']);
    const user = await this.prismaService.user.findFirst({
      where: {
        AND: {
          username: {
            equals: request.username,
          },
          isDelete: {
            equals: false
          },
        },
      },
    });
    if (!user) {
      throw new HttpException(
        'Invalid username',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isCorrectHash = await verifyPassword(user.password, request.password);
    if (!isCorrectHash) {
      throw new HttpException(
        'Invalid password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    
    const token = await generateToken({
      userId: user.id,
      username: user.username,
    });
    return {
      token,
      message: 'Login successful',
    } as AuthResponseDto;
  }

  async signup(
    request: AuthReqeustDto,
    file: Express.Multer.File,
  ): Promise<AuthResponseDto> {
    validateRequest(request, ['username', 'password']);
    validateFilePicture(file);

    return await this.prismaService.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          username: request.username,
          password: await hashPassword(request.password),
        },
      });

      const picture: UploadFileResponseDto =
        await this.fileService.uploadPicture(file);

      await prisma.userPictures.create({
        data: {
          pictureId: picture.pictureId as bigint,
          userId: user.id,
        },
      });
      return {
        message: 'Register successful',
      } as AuthResponseDto;
    });
  }

  async verifyFace(
    id: string,
    files: Express.Multer.File[],
  ): Promise<BaseResponseObjectDto> {
    if (files.length !== 2) {
      throw new HttpException(
        'Please upload 2 images.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const [profileImage, currentImage] = files;
    const externalRequest = {
      profileImage: profileImage,
      currentImage: currentImage,
    };
    const serviceVerify = await this.externalService.callExternalAPI(
      id,
      externalRequest,
    );
    if (serviceVerify.verifyResult) {
      return {
        success: true,
        message: 'Face authentication successful.',
      } as BaseResponseObjectDto;
    }

    return {
      success: false,
      message: 'Face authentication failed.',
    } as BaseResponseObjectDto;
  }
}
