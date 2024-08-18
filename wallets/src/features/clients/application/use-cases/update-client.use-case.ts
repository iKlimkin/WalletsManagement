import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Client } from '../../domain/entities/client.entity';
import { ClientsRepository } from '../../infrastructure/clients.repository';
import {
  DomainNotificationResponse,
  NotificationResponse,
} from '../../../../core/validation/notification';
import { UpdateClientDTO } from '../../dto/update-client.dto';
import { BaseUseCase } from '../../../../infrastructure/app/base-use-case';
import { StoreService } from '../../store.service';

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
    eventBus: EventBus,
    storeService: StoreService,
  ) {
    super(storeService, eventBus);
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
