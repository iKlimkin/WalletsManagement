import {
  ValidationPipe,
  INestApplication,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { swaggerSetup } from './swaggerSetup';

export const pipesSetup = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory(errors: ValidationError[]) {
        const customErrors: ValidationPipeErrorType[] = [];

        errors.forEach((errors: ValidationError) => {
          const constraints = errors.constraints;

          if (constraints) {
            const constraintKeys = Object.keys(constraints);

            constraintKeys.forEach((cKey: string) => {
              const message = constraints[cKey];

              customErrors.push({ message, field: errors.property });
            });
          }
        });

        throw new BadRequestException(customErrors);
      },
    }),
  );
  swaggerSetup(app);
};

export type ValidationPipeErrorType = {
  field: string;
  message: string;
};
