import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthcheck-service')
  getHello(): { status: number; message: string } {
    return {
      status: HttpStatus.OK,
      message: 'Service is up and running',
    };
  }
}
