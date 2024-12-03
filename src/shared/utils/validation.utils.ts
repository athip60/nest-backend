import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';

export function validateFilePicture(file: Express.Multer.File) {
  const allowedMimeTypes = ['image/jpeg', 'image/png'];
  const maxSizeInBytes = 5 * 1024 * 1024;
  if (!file) {
    throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
  }
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new HttpException('Invalid file type', HttpStatus.BAD_REQUEST);
  }
  if (file.size > maxSizeInBytes) {
    throw new HttpException('File size exceeds 5MB', HttpStatus.BAD_REQUEST);
  }
}
