import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Client, CreateClientDTO } from '../../domain/entities/client.entity';
import { ClientsRepository } from '../../infrastructure/clients.repository';

export class CreateClientCommand {
  constructor(
    public readonly dto: CreateClientDTO
  ) {}
}

@CommandHandler(CreateClientCommand)
export class CreateClientUseCase implements ICommandHandler<CreateClientCommand> {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute(command: CreateClientCommand) {
    const { dto } = command
    const client = Client.createEntity(dto)
    
    await this.clientsRepository.save(client);

    return client
  }
}
