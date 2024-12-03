import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common/decorators';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ExternalService {
  constructor(private readonly httpService: HttpService) {}

  async callExternalAPI(id ,externalRequest): Promise<any> {
    const url =
      `https://0911ae6f-f9df-4e18-ad1e-573a5e71da40.mock.pstmn.io/api/face-verify/${id}`;
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
