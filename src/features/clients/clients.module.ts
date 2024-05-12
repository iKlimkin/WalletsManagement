import { Module } from '@nestjs/common';
import { ClientsService } from './application/clients.service';
import { ClientsController } from './api/admin-web/clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './domain/entities/client.entity';
import { ClientsQueryRepository } from './infrastructure/clients.query.repository';
import { ClientsRepository } from './infrastructure/clients.repository';
import { CreateClientUseCase } from './application/use-cases/create-client.use-case';

const useCases = [
  CreateClientUseCase
]

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    ClientsQueryRepository,
    ClientsRepository,
    ...useCases,
  ],
})
export class ClientsModule {}
