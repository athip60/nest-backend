import { IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthReqeustDto {
  @ApiProperty({ description: 'Username', required: true })
  @IsString()
  username: string;
  
  @ApiProperty({ description: 'Password', required: true })
  @IsString()
  password: string;
}
