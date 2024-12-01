import { UserResponseDto } from '../dto/user-response.dto';
import { UserRequestDto } from '../dto/user-request.dto';
import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common/decorators';

@Controller('api/users')
export class UserController {
  constructor() { }

  @Get()
  async getUsers(): Promise<UserResponseDto> {
    return {} as UserResponseDto;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return {} as UserResponseDto;
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() request: UserRequestDto
  ): Promise<UserResponseDto> {
    return {} as UserResponseDto;
  }

  @Delete(':id')
  async hardDeleteUser(@Param('id') id: string): Promise<UserResponseDto> {
    return {} as UserResponseDto;
  }
}
