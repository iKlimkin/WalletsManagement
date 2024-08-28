import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { ClientsRepository } from '../../infrastructure/clients.repository';

import { StoreService } from '../../../../core/infrastructure/adapters/store.service';
import { WalletsRepository } from '../../../wallets/infrastructure/wallets.repository';
import { Client } from '../../domain/entities/client.entity';
import { BaseUseCase } from '../../../../core/app/base-use-case';
import { BaseUseCaseServicesWrapper } from '../../../../core/infrastructure/base-use-cases-services.wrapper';

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
    baseUseCaseServicesWrapper: BaseUseCaseServicesWrapper,
  ) {
    super(baseUseCaseServicesWrapper);
  }

  async onExecute(command: DeleteClientCommand) {
    const client = await this.clientsRepository.getById(command.id);
    const wallets = await this.walletsRepo.getMany({ clientId: client.id });
    const domainNotice = await client.delete(wallets);
    await this.clientsRepository.delete(command.id);
    return domainNotice;
  }
}
