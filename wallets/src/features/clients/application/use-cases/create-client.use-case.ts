import { CommandHandler } from '@nestjs/cqrs';
import { SecurityGovApiAdapter } from '../../../../core/infrastructure/adapters/security-gov-api.adapter';
import { DomainNotificationResponse } from '../../../../core/validation/notification';
import { Client } from '../../domain/entities/client/client.entity';
import { CreateClientDTO } from '../../dto/create-client.dto';
import { ClientsRepository } from '../../infrastructure/clients.repository';
import { BaseUseCase } from '../../../../core/app/base-use-case';
import { BaseUseCaseServicesWrapper } from '../../../../core/infrastructure/base-use-cases-services.wrapper';

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
    baseUseCaseServicesWrapper: BaseUseCaseServicesWrapper,
  ) {
    super(baseUseCaseServicesWrapper);
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

    return domainNotification;
  }
}
