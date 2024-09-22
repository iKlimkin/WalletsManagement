import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BaseCrudApiService } from '../../../../core/api/services/base-crud-api.service';
import { CreateClientCommand } from '../../application/use-cases/create-client.use-case';
import { Client } from '../../domain/entities/client/client.entity';
import {
  ClientViewModel,
  ClientsQueryRepository,
} from '../../infrastructure/clients.query.repository';

@Injectable()
export class ClientCrudApiService extends BaseCrudApiService<
  Client,
  CreateClientCommand,
  ClientViewModel
> {
  constructor(commandBus: CommandBus, queryRepo: ClientsQueryRepository) {
    super(commandBus, queryRepo);
  }
}
