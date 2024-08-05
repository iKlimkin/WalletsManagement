import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './features/clients/clients.module';
import { WalletsModule } from './features/wallets/wallets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsyncStorageMiddleware } from './config/local-storage.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'wallets-management',
      synchronize: true,
      autoLoadEntities: true,
    }),
    ClientsModule,
    WalletsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AsyncStorageMiddleware).forRoutes('*');
  }
}
