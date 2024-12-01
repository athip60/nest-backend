import { Controller, Get } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  getHello(): { status: number; message: string } {
    return {
      status: HttpStatus.OK,
      message: 'Service is up and running',
    };
  }
}
