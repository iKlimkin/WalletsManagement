import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientsRepository } from '../../infrastructure/clients.repository';

export class DeleteClientCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteClientCommand)
export class DeleteClientUseCase
  implements ICommandHandler<DeleteClientCommand>
{
  constructor(private clientsRepository: ClientsRepository) {}

  async execute(command: DeleteClientCommand) {
    await this.clientsRepository.delete(command.id);
  }
}
