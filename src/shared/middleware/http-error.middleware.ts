import { Catch } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common/interfaces';
import { PrismaService } from '@prisma/prisma.service';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly prisma: PrismaService) { }

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException
      ? exception.getResponse()
      : exception.message || 'ระบบขัดข้อง';

    try {
      await this.prisma.errorLog.create({
        data: {
          timestamp: new Date(),
          errorMessage: typeof message === 'string'
            ? message
            : (message as any).message || message,
          stackTrace: exception.stack,
          errorCode: exception instanceof HttpException
            ? exception.getStatus().toString()
            : '500',
          userId: null,
          url: request.url,
          method: request.method
        },
      });
    } catch (err) {
      console.error('Failed to save error log:', err);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'string'
        ? message
        : (message as any).message || message,
    });
  }
}
