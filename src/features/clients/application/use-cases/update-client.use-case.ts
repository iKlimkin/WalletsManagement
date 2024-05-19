import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateClientDTO } from '../../domain/entities/client.entity';
import { ClientsRepository } from '../../infrastructure/clients.repository';

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
    client.update(command)
    await this.clientsRepository.save(client);
  }
}
