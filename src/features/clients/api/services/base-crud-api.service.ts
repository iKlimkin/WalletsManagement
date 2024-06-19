import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { NotificationResponse } from '../../../../core/validation/notification';
import {
  BaseQueryRepository,
  ClientViewModel,
  ClientsQueryRepository,
} from '../../infrastructure/clients.query.repository';
import { BaseDomainEntity } from '../../../../core/baseEntity';
import { CreateClientCommand } from '../../application/use-cases/create-client.use-case';
import { Client } from '../../domain/entities/client.entity';

export class ItemCreatedNotification<TViewModel> extends NotificationResponse<{
  item: TViewModel;
}> {
  constructor(viewModel: TViewModel) {
    super();
    this.addData({ item: viewModel });
  }
}

export class BaseCrudApiService<
  TEntity extends BaseDomainEntity,
  TCommand,
  TViewModel,
> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryRepo: BaseQueryRepository<TViewModel>,
  ) {}
  async create(
    command: TCommand,
  ): Promise<ItemCreatedNotification<TViewModel>> {
    const notification = await this.commandBus.execute<
      TCommand,
      NotificationResponse<TEntity>
    >(command);

    if (notification.hasError()) {
      throw new BadRequestException(notification.extensions);
    }
    const viewModel = await this.queryRepo.getById(notification.data.id);
    return new ItemCreatedNotification(viewModel);
  }
}

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
