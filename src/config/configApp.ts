import { INestApplication } from '@nestjs/common';
import { swaggerSetup } from './swaggerSetup';

export const configApp = (app: INestApplication) => {
  swaggerSetup(app);
};
