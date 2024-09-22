import { CommandHandler } from '@nestjs/cqrs';
import { BaseUseCaseServicesWrapper } from '../../../../core/infrastructure/base-use-cases-services.wrapper';
import { Client } from '../../domain/entities/client/client.entity';
import { ClientsRepository } from '../../infrastructure/clients.repository';
import { DomainNotificationResponse } from '../../../../core/validation/notification';
import { UpdatePassportCommand } from '../../dto/update-passport.command';
import { BaseUseCase } from '../../../../core/app/base-use-case';

@CommandHandler(UpdatePassportCommand)
export class UpdateClientPassportUseCase extends BaseUseCase<
  UpdatePassportCommand,
  Client
> {
  constructor(
    private clientsRepo: ClientsRepository,
    baseUseCaseServicesWrapper: BaseUseCaseServicesWrapper,
  ) {
    super(baseUseCaseServicesWrapper);
  }

  protected async onExecute(
    command: UpdatePassportCommand,
  ): Promise<DomainNotificationResponse<Client>> {
    const client = await this.clientsRepo.getById(command.clientId);
    client.updatePassport(command);
    await this.clientsRepo.save(client);
    return new DomainNotificationResponse<Client>();
  }
}
