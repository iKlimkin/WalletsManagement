import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Client, CreateClientDTO } from '../../domain/entities/client.entity';
import { ClientsRepository } from '../../infrastructure/clients.repository';
import { SecurityGovApiAdapter } from '../../infrastructure/security-gov-api.adapter';
import { NotificationResponse } from '../../../../core/validation/notification';

export class CreateClientCommand {
  constructor(public readonly dto: CreateClientDTO) {}
}

@CommandHandler(CreateClientCommand)
export class CreateClientUseCase
  implements ICommandHandler<CreateClientCommand>
{
  constructor(
    private clientsRepository: ClientsRepository,
    public readonly security: SecurityGovApiAdapter,
  ) {}

  async execute(
    command: CreateClientCommand,
  ): Promise<NotificationResponse<Client>> {
    const { dto } = command;
    const notice = new NotificationResponse<Client>();

    const scammer = await this.security.isScammer(dto.firstName, dto.lastName);

    if (scammer) {
      notice.addError('Client is a scammer', null, 2);
      return notice;
    }

    const client = await Client.createEntity(dto);

    await this.clientsRepository.save(client);

    notice.addData(client);

    return notice;
  }
}
