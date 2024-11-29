import { Exclude, Expose } from "@nestjs/class-transformer";

@Exclude()
export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  status: string;
}
