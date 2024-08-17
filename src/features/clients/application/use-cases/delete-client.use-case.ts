import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ClientsRepository } from '../../infrastructure/clients.repository';
import { BaseUseCase } from '../../../../infrastructure/app/base-use-case';
import { Client } from '../../domain/entities/client.entity';
import { StoreService } from '../../store.service';
import { DomainNotificationResponse } from '../../../../core/validation/notification';
import { WalletsRepository } from '../../../wallets/infrastructure/wallets.repository';

export class DeleteClientCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteClientCommand)
export class DeleteClientUseCase extends BaseUseCase<
  DeleteClientCommand,
  Client
> {
  constructor(
    private clientsRepository: ClientsRepository,
    private walletsRepo: WalletsRepository,
    eventBus: EventBus,
    storeService: StoreService,
  ) {
    super(storeService, eventBus);
  }

  async onExecute(command: DeleteClientCommand) {
    const client = await this.clientsRepository.getById(command.id);
    const wallets = await this.walletsRepo.getMany({ clientId: client.id });
    const domainNotice = await client.delete(wallets);
    await this.clientsRepository.delete(command.id);
    return domainNotice;
  }
}
