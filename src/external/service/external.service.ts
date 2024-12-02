import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ExternalService {
  constructor(private readonly httpService: HttpService) {}

  async callExternalAPI(id ,externalRequest): Promise<any> {
    const url =
      `https://71bc20a3-fa9c-4cd6-a6f3-490a8cd452bf.mock.pstmn.io/api/face-verify/${id}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.post(url, { headers }),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
