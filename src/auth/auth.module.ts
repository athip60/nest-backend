import { Module } from "@nestjs/common/decorators/modules";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { PrismaService } from "@prisma/prisma.service";
import { FileModule } from "src/file/file.module";
import { ExternalModule } from "src/external/external.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  imports: [FileModule, ExternalModule],
})
export class AuthModule { }
