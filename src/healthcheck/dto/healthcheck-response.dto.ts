import { Exclude, Expose } from "@nestjs/class-transformer";

@Exclude()
export class HealthcheckResponseDto {
  @Expose()
  id: number;

  @Expose()
  status: string;
}
