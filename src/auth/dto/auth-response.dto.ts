import { Exclude, Expose } from "@nestjs/class-transformer/types/decorators";

@Exclude()
export class AuthResponseDto {
  @Expose()
  token: string;

  @Expose()
  message: string;
}

