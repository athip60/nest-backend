import { HttpStatus } from '@nestjs/common';

export class BaseResponseObjectDto {
  status: HttpStatus = HttpStatus.OK;
  success: boolean;
  message: string;
}
