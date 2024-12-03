import { IsEmail, IsNotEmpty, IsString, Matches } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthReqeustDto {
  @ApiProperty({ description: 'Username', required: true })
  @IsEmail({}, { message: 'Invalid email format' })
  username: string;

  @ApiProperty({ description: 'Password', required: true })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(
    /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/,
    {
      message:
        'Password must contain at least 8 characters, one letter, one number, and one special character',
    },
  )
  password: string;
}
