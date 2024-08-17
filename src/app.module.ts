import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlsModule } from './als-module/als.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AsyncStorageMiddleware } from './config/local-storage.middleware';
import { CoreModule } from './core/modules/core.module';
import { ClientsModule } from './features/clients/clients.module';
import { WalletsModule } from './features/wallets/wallets.module';

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
    CoreModule,
    AlsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AsyncStorageMiddleware).forRoutes('*');
  }
}
