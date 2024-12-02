import { Injectable } from '@nestjs/common/decorators';
import { NestMiddleware } from '@nestjs/common/interfaces';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyToken(token);
      req['user'] = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}