import { SignUrlResponseDto } from 'src/shared/dto/sign-url-response.dto';

export class UserResponseDto {
  id: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  isDelete: boolean;
  picture?: SignUrlResponseDto
}
