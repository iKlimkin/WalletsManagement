import { CommandHandler } from '@nestjs/cqrs';
import { BaseUseCaseServicesWrapper } from '../../../../core/infrastructure/base-use-cases-services.wrapper';
import { WalletsRepository } from '../../../wallets/infrastructure/wallets.repository';
import { Client } from '../../domain/entities/client/client.entity';
import { ClientsRepository } from '../../infrastructure/clients.repository';
import { BaseUseCase } from '../../../../core/app/base-use-case';
import { DomainNotificationResponse } from '../../../../core/validation/notification';

export class RejectClientCommand {
  constructor(public id: string) {}
}
@CommandHandler(RejectClientCommand)
export class RejectClientUseCase extends BaseUseCase<
  RejectClientCommand,
  Client
> {
  constructor(
    private clientsRepo: ClientsRepository,
    private walletsRepo: WalletsRepository,
    baseUseCaseServicesWrapper: BaseUseCaseServicesWrapper,
  ) {
    super(baseUseCaseServicesWrapper);
  }
  protected async onExecute(
    command: RejectClientCommand,
  ): Promise<DomainNotificationResponse<Client>> {
    const client = await this.clientsRepo.getById(command.id);
    client.reject();
    await this.clientsRepo.save(client);
    return new DomainNotificationResponse<Client>();
  }
}
