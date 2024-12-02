import { Module } from "@nestjs/common/decorators/modules";
import { HttpModule } from '@nestjs/axios';
import { ExternalService } from "./service/external.service";

@Module({
  imports: [HttpModule],
  providers: [ExternalService],
  exports: [ExternalService]
})
export class ExternalModule {}
