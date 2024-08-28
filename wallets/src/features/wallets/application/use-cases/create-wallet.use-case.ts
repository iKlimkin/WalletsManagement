import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { IsString } from 'class-validator';
import { DomainNotificationResponse } from '../../../../core/validation/notification';
import { Wallet } from '../../domain/entities/wallet.entity';
import { WalletsRepository } from '../../infrastructure/wallets.repository';

import { BaseUseCase } from '../../../../core/app/base-use-case';
import { StoreService } from '../../../../core/infrastructure/adapters/store.service';
import { BaseUseCaseServicesWrapper } from '../../../../core/infrastructure/base-use-cases-services.wrapper';

export class CreateWalletCommand {
  @IsString()
  clientId: string;
}

@CommandHandler(CreateWalletCommand)
export class CreateWalletUseCase extends BaseUseCase<
  CreateWalletCommand,
  Wallet
> {
  constructor(
    private walletsRepository: WalletsRepository,
    baseUseCaseServicesWrapper: BaseUseCaseServicesWrapper,
  ) {
    super(baseUseCaseServicesWrapper);
  }

  async onExecute(
    command: CreateWalletCommand,
  ): Promise<DomainNotificationResponse<Wallet>> {
    const domainNotice = await Wallet.create(command);
    await this.walletsRepository.save(domainNotice.data);
    return domainNotice;
  }
}
