import { Controller, Get } from '@nestjs/common';
import { HealthcheckResponseDto } from '../dto/healthcheck-response.dto';

@Controller('healthcheck')
export class HealthcheckController {
  constructor() {}

  @Get()
  async getHealthcheckStatus(): Promise<HealthcheckResponseDto> {
    return {
      id: 1,
      status: "I'm find. Thank you. :)"
    } as HealthcheckResponseDto;
  }
}
