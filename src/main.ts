import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configApp } from './config/configApp';

const PORT = process.env.PORT || 5000;

(async () => {
  const app = await NestFactory.create(AppModule);
  configApp(app);
  await app.listen(PORT, () => `App starts on port: ${PORT}`);
})();
