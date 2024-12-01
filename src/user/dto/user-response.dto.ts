import { Exclude, Expose } from "@nestjs/class-transformer/types/decorators";

@Exclude()
export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  status: string;
}
