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
import {
  DomainError,
  mapErrorsToNotification,
} from '../core/validation/validation-utils';

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
    const { message, key } = exception.getResponse() as any;
    const notificationResponse = exception.getResponse();
    const status = exception.getStatus();

    if (status === HttpStatus.BAD_REQUEST) {
      const localResponse = exception.getResponse();
      if (localResponse instanceof NotificationResponse) {
        response.status(status).send(notificationResponse);
        return;
      }
      const resultNotification = mapErrorsToNotification(message);

      response.status(status).send(resultNotification);
    } else {
      response.status(status).json({
        status,
        timestamp: new Date().toISOString(),
        location: key,
        error: message,
        path: request.url,
      });
    }
  }
}
