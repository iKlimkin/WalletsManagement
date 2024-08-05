import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './api/admin-web/clients.controller';
import { ClientsService } from './application/clients.service';
import { CreateClientUseCase } from './application/use-cases/create-client.use-case';
import { DeleteClientUseCase } from './application/use-cases/delete-client.use-case';
import { UpdateClientUseCase } from './application/use-cases/update-client.use-case';
import { Client } from './domain/entities/client.entity';
import { ClientsQueryRepository } from './infrastructure/clients.query.repository';
import { ClientsRepository } from './infrastructure/clients.repository';
import { SecurityGovApiAdapter } from './infrastructure/security-gov-api.adapter';
import { ClientCrudApiService } from './api/services/clients-curd-api.service';
import { StoreService } from './store.service';

const useCases = [
  CreateClientUseCase,
  UpdateClientUseCase,
  DeleteClientUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([Client]), CqrsModule],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    ClientsQueryRepository,
    ClientsRepository,
    SecurityGovApiAdapter,
    ClientCrudApiService,
    StoreService,
    ...useCases,
  ],
})
export class ClientsModule {
  static forRoot(providers: any[]): DynamicModule {
    return {
      module: ClientsModule,
      providers,
    };
  }
}
