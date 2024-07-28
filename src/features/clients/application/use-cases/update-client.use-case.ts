import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Client, UpdateClientDTO } from '../../domain/entities/client.entity';
import { ClientsRepository } from '../../infrastructure/clients.repository';
import { NotificationResponse } from '../../../../core/validation/notification';

export class UpdateClientCommand {
  constructor(public readonly dto: UpdateClientDTO) {}
}

@CommandHandler(UpdateClientCommand)
export class UpdateClientUseCase
  implements ICommandHandler<UpdateClientCommand>
{
  constructor(private clientsRepository: ClientsRepository) {}

  async execute(command: UpdateClientCommand) {
    const client = await this.clientsRepository.getById(command.dto.id);

    if (!client) throw new Error('Client not found');
    const domainNotification = await client.update(command);
    if (domainNotification.hasError) return domainNotification;

    await this.clientsRepository.save(domainNotification.data);
    return new NotificationResponse<Client>();
  }
}
