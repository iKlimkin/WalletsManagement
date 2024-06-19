import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from './exception.filter';

export const exceptionFilterSetup = (app: INestApplication) => {
  app.useGlobalFilters(new HttpExceptionFilter());
};


