import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Client } from '../../domain/entities/client.entity';
import { ClientsRepository } from '../../infrastructure/clients.repository';
import { SecurityGovApiAdapter } from '../../../../core/infrastructure/adapters/security-gov-api.adapter';
import {
  DomainNotificationResponse,
  NotificationResponse,
} from '../../../../core/validation/notification';
import { CreateClientDTO } from '../../dto/create-client.dto';
import { BaseUseCase } from '../../../../infrastructure/app/base-use-case';
import { StoreService } from '../../store.service';

export class CreateClientCommand {
  constructor(public readonly dto: CreateClientDTO) {}
}

@CommandHandler(CreateClientCommand)
export class CreateClientUseCase extends BaseUseCase<
  CreateClientCommand,
  Client
> {
  constructor(
    private clientsRepository: ClientsRepository,
    private readonly security: SecurityGovApiAdapter,
    protected eventBus: EventBus,
    protected storeService: StoreService,
  ) {
    super(storeService, eventBus);
  }

  async onExecute(
    command: CreateClientCommand,
  ): Promise<DomainNotificationResponse<Client>> {
    const { dto } = command;

    const scammer = await this.security.isScammer(dto.firstName, dto.lastName);

    if (scammer) {
      const notice = new DomainNotificationResponse<Client>();
      notice.addError('Client is a scammer', 'lastName', 2);
      return notice;
    }

    const domainNotification = await Client.createEntity(dto);
    if (domainNotification.hasError) return domainNotification;
    await this.clientsRepository.save(domainNotification.data);
    this.eventBus.publishAll(domainNotification.data.getUncommittedEvents());

    return domainNotification;
  }
}
