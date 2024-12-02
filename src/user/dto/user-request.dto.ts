import { IsBoolean, IsNotEmpty, IsString } from "@nestjs/class-validator";

export class UserRequestDto {
  @IsString()
  username: string;
  
  @IsBoolean()
  isDelete: boolean;
}
