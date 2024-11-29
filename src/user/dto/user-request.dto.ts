import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class UserRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  pictureProfile: string;
}
