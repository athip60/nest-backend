import { IsBoolean, IsEmail, IsOptional } from "@nestjs/class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UserRequestDto {
  @ApiPropertyOptional({ description: 'Username' })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  username?: string;

  @ApiPropertyOptional({ description: 'Soft delete user' })
  @IsOptional()
  @IsBoolean({ message: 'isDelete must be a boolean value' })
  isDelete?: boolean;
}
