import { Injectable } from '@nestjs/common/decorators';
import { UserRequestDto } from '../dto/user-request.dto';
import { FileService } from 'src/file/services/file.service';
import { PrismaService } from '@prisma/prisma.service';
import { UserResponseDto } from '../dto/user-response.dto';
import { MinioService } from 'src/shared/minio/services/minio.service';
import { convertPathFile } from 'src/shared/utils/minio.utils';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { validateRequestUpdateUser } from 'src/shared/utils/validation.utils';
import { BaseResponseObjectDto } from 'src/shared/dto/response.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
    private readonly minioService: MinioService,
  ) { }

  async getUserById(req: Request): Promise<UserResponseDto> {
    const userId = req['user']['userId'];
    const user = await this.prismaService.user.findFirst({
      where: {
        AND: {
          id: {
            equals: userId,
          },
          isDelete: {
            equals: false,
          },
        },
      },
      include: {
        userPictures: {
          include: {
            picture: true,
          },
        },
      },
    });
    if (!user) {
      throw new HttpException(
        'Not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const picture = user.userPictures?.picture;
    const pictureUrl = picture
      ? (
        await this.minioService.getSignedUrl(
          convertPathFile(picture.path, picture.key, picture.type),
        )
      ).url
      : null;
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isDelete: user.isDelete,
      picture: picture
        ? {
          id: picture.id.toString(),
          url: pictureUrl,
        }
        : null,
    };
  }

  async updateUser(
    req: Request,
    request: Partial<UserRequestDto>,
    pictureProfile: Express.Multer.File,
  ): Promise<BaseResponseObjectDto> {
    const userId = req['user']['userId'];
    validateRequestUpdateUser(request, pictureProfile);

    const existingUser = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { userPictures: true },
    });

    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return await this.prismaService.$transaction(async (prisma) => {
      // object for update
      const userUpdate: Partial<UserRequestDto & { userPictures?: any }> = {};

      if (request.username != undefined) {
        const dupUsername = await prisma.user.findFirst({
          where: {
            AND: {
              username: {
                equals: request.username,
              },
              id: { not: userId },
            },
          },
        });
        if (dupUsername) {
          throw new HttpException(
            'Duplicate request username',
            HttpStatus.BAD_REQUEST,
          );
        }
        userUpdate.username = request.username;
      }
      if (request.isDelete != undefined) {
        userUpdate.isDelete = Boolean(request.isDelete);
      }
      // map & create picture for update
      if (pictureProfile) {
        await prisma.userPicturesLog.create({
          data: {
            userId: existingUser.userPictures.userId,
            pictureId: existingUser.userPictures.pictureId,
          },
        });
        const picture = await this.fileService.uploadPicture(pictureProfile);
        userUpdate.userPictures = {
          update: { pictureId: picture.pictureId },
        };
      }

      // execute update
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...userUpdate,
        },
        include: { userPictures: { include: { picture: true } } },
      });
      return {
        success: true,
        message: 'Update user successful.',
      } as BaseResponseObjectDto;
    });
  }

  async hardDeleteUser(req: Request): Promise<BaseResponseObjectDto> {
    const userId = req['user']['userId'];
    await this.prismaService.$transaction(async (prisma) => {
      await prisma.userPictures.delete({
        where: {
          id: userId,
        },
      });
      await prisma.userPicturesLog.deleteMany({
        where: {
          id: userId,
        },
      });
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });
    });
    return {
      success: true,
      message: 'Delete user successful.',
    } as BaseResponseObjectDto;
  }
}


