import { BadRequestException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BaseDomainEntity } from '../../baseEntity';
import { NotificationResponse } from '../../validation/notification';
import { BaseQueryRepository } from '../../db/base.query.repository';

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
  ): Promise<
    ItemCreatedNotification<TViewModel> | NotificationResponse<TEntity>
  > {
    const notification = await this.commandBus.execute<
      TCommand,
      NotificationResponse<TEntity>
    >(command);

    if (notification.hasError) throw new BadRequestException(notification);

    const viewModel = await this.queryRepo.getById(notification.data.id);
    return new ItemCreatedNotification(viewModel);
  }
}
