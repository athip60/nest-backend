import { Injectable } from "@nestjs/common/decorators";
import { AuthResponseDto } from "../dto/auth-response.dto";
import { AuthReqeustDto } from "../dto/auth-request.dto";
import { PrismaService } from "@prisma/prisma.service";
import { FileService } from "src/file/services/file.service";
import { validateFilePicture, validateRequest } from "src/shared/utils/validation.utils";
import { UploadFileResponseDto } from "src/shared/dto/upload-file-response.dto";
import { hashPassword, verifyPassword } from "src/shared/utils/hash.utlis";
import { generateToken } from "src/shared/utils/jwt.utils";
import { UnauthorizedException } from "@nestjs/common/exceptions";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService
  ) { }

  async signin(request: AuthReqeustDto): Promise<AuthResponseDto> {
    validateRequest(request, ['username', 'password']);
    const user = await this.prismaService.user.findFirst({
      where: {
        AND: {
          username: {
            equals: request.username,
          }
        }
      }
    })

    if (!user || await !verifyPassword(user.password, request.password)) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const token = await generateToken({ userId: user.id, username: user.username });
    return {
      token,
      message: 'Login successful',
    } as AuthResponseDto;
  }

  async signup(request: AuthReqeustDto, file: Express.Multer.File): Promise<AuthResponseDto> {
    validateRequest(request, ['username', 'password']);
    validateFilePicture(file);

    return await this.prismaService.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          username: request.username,
          password: await hashPassword(request.password)
        },
      });

      const picture: UploadFileResponseDto = await this.fileService.uploadPicture(file);

      await prisma.userPictures.create({
        data: {
          pictureId: picture.pictureId,
          userId: user.id,
        },
      });
      return {
        message: 'Register successful',
      } as AuthResponseDto;
    });
  }
}