import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './api/admin-web/clients.controller';
import {
  ClientCrudApiService
} from './api/services/base-crud-api.service';
import { ClientsService } from './application/clients.service';
import { CreateClientUseCase } from './application/use-cases/create-client.use-case';
import { DeleteClientUseCase } from './application/use-cases/delete-client.use-case';
import { UpdateClientUseCase } from './application/use-cases/update-client.use-case';
import { Client } from './domain/entities/client.entity';
import {
  ClientsQueryRepository
} from './infrastructure/clients.query.repository';
import { ClientsRepository } from './infrastructure/clients.repository';
import { SecurityGovApiAdapter } from './infrastructure/security-gov-api.adapter';

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
    ...useCases,
  ],
  exports: [],
})
export class ClientsModule {}
