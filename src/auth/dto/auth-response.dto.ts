import { Exclude, Expose } from "@nestjs/class-transformer/types/decorators";
import { BaseResponseObjectDto } from "src/shared/dto/response.dto";

@Exclude()
export class AuthResponseDto extends BaseResponseObjectDto {
  @Expose()
  token: string;
}

