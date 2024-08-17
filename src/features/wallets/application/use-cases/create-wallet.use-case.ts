import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import {
  DomainNotificationResponse,
  NotificationResponse,
} from '../../../../core/validation/notification';
import { CurrencyType, Wallet } from '../../domain/entities/wallet.entity';
import { WalletsRepository } from '../../infrastructure/wallets.repository';
import { IsString } from 'class-validator';
import { BaseUseCase } from '../../../../infrastructure/app/base-use-case';
import { StoreService } from '../../../clients/store.service';

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
    eventBus: EventBus,
    storeService: StoreService,
  ) {
    super(storeService, eventBus);
  }

  async onExecute(
    command: CreateWalletCommand,
  ): Promise<DomainNotificationResponse<Wallet>> {
    const domainNotice = await Wallet.create(command);
    await this.walletsRepository.save(domainNotice.data);
    return domainNotice;
  }
}
