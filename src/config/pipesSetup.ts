import { ValidationPipe, INestApplication } from '@nestjs/common';
import { swaggerSetup } from './swaggerSetup';

export const pipesSetup = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  swaggerSetup(app);
};
