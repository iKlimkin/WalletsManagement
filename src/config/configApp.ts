import { INestApplication } from '@nestjs/common';
import { swaggerSetup } from './swaggerSetup';
import { pipesSetup } from './pipesSetup';

export const configApp = (app: INestApplication) => {
  pipesSetup(app);
  swaggerSetup(app);
};
