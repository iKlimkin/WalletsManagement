import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configApp } from './config/configApp';

const PORT = process.env.PORT || 4321;

(async () => {
  const app = await NestFactory.create(AppModule);
  configApp(app);
  await app.listen(PORT, () => {
    console.log(`App starts on port: ${PORT}`);
  });
})();
