import { HttpStatus } from "@nestjs/common/enums";
import { HttpException } from "@nestjs/common/exceptions";

export function validateRequest<T>(request: T, fieldRequest: string[]) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  fieldRequest.forEach((field) => {
    switch (field) {
      case 'username':
        if (!request['username'] || !emailRegex.test(request['username'])) {
          throw new HttpException('Invalid format email or missing', HttpStatus.BAD_REQUEST);
        }

      case 'password':
        if (!request['password'] || !passwordRegex.test(request['password'])) {
          throw new HttpException('Invalid or missing password', HttpStatus.BAD_REQUEST);
        }
    }
  })
}

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