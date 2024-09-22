import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Client } from '../../domain/entities/client/client.entity';
import { UpdateClientDTO } from '../../dto/update-client.dto';
import { ClientsRepository } from '../../infrastructure/clients.repository';

import { StoreService } from '../../../../core/infrastructure/adapters/store.service';
import { BaseUseCase } from '../../../../core/app/base-use-case';
import { BaseUseCaseServicesWrapper } from '../../../../core/infrastructure/base-use-cases-services.wrapper';

export class UpdateClientCommand {
  constructor(public readonly dto: UpdateClientDTO) {}
}

@CommandHandler(UpdateClientCommand)
export class UpdateClientUseCase extends BaseUseCase<
  UpdateClientCommand,
  Client
> {
  constructor(
    private clientsRepository: ClientsRepository,
    baseUseCaseServicesWrapper: BaseUseCaseServicesWrapper,
  ) {
    super(baseUseCaseServicesWrapper);
  }

  async onExecute(command: UpdateClientCommand) {
    const client = await this.clientsRepository.getById(command.dto.id);

    if (!client) throw new Error('Client not found');
    const domainNotification = await client.update(command);
    if (domainNotification.hasError) return domainNotification;

    await this.clientsRepository.save(domainNotification.data);

    // this.eventBus.publishAll(domainNotification.data.getUncommittedEvents());

    return domainNotification;
  }
}
