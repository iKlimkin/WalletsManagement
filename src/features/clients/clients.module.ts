import { Module } from '@nestjs/common';
import { ClientsService } from './application/clients.service';
import { ClientsController } from './api/admin-web/clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './domain/entities/client.entity';
import { ClientsQueryRepository } from './infrastructure/clients.query.repository';
import { ClientsRepository } from './infrastructure/clients.repository';
import { CreateClientUseCase } from './application/use-cases/create-client.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteClientUseCase } from './application/use-cases/delete-client.use-case';
import { UpdateClientUseCase } from './application/use-cases/update-client.use-case';

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
    ...useCases,
  ],
  exports: [],
})
export class ClientsModule {}
