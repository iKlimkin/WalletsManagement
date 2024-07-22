import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { NotificationResponse } from '../core/validation/notification';
import { ValidationPipeErrorType } from './pipesSetup';
import { DomainError } from '../core/validation/validation-utils';

@Catch(DomainError)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response
      .status(HttpStatus.BAD_REQUEST)
      .send(exception.notificationResponse);
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { message, key, statusCode } = exception.getResponse() as any;

    if (statusCode === HttpStatus.BAD_REQUEST) {
      if (response instanceof NotificationResponse) {
        response.status(statusCode).send(message);
        return;
      }
      const notificationResult = new NotificationResponse();
      const code = 1;
      if (Array.isArray(message)) {
        message.forEach((m: ValidationPipeErrorType) => {
          notificationResult.addError(m.message, m.field, code);
        });
      } else {
        notificationResult.addError(message, null, code);
      }

      response.status(statusCode).send(notificationResult);
    } else {
      response.status(statusCode).json({
        statusCode,
        timestamp: new Date().toISOString(),
        location: key,
        error: message,
        path: request.url,
      });
    }
  }
}
