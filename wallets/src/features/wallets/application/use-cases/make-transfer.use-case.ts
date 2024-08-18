import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { IsNumber, IsString } from 'class-validator';
import {
  DomainNotificationResponse,
  NotificationResponse,
} from '../../../../core/validation/notification';
import { BaseUseCase } from '../../../../infrastructure/app/base-use-case';
import { StoreService } from '../../../clients/store.service';
import {
  MoneyMoneyTransferType,
  MoneyTransfer,
} from '../../domain/entities/money-transfer.entity';
import { MoneyTransferRepository } from '../../infrastructure/money-transfer.repository';
import { WalletsRepository } from '../../infrastructure/wallets.repository';

export class MakeMoneyTransferCommand {
  @IsString()
  fromWalletId: string;
  @IsString()
  toWalletId: string;
  @IsNumber()
  amount: number;
}

@CommandHandler(MakeMoneyTransferCommand)
export class MakeMoneyTransferUseCase extends BaseUseCase<
  MakeMoneyTransferCommand,
  MoneyTransfer
> {
  constructor(
    private walletsRepository: WalletsRepository,
    private moneyTransferRepository: MoneyTransferRepository,
    protected storeService: StoreService,
    protected eventBus: EventBus,
  ) {
    super(storeService, eventBus);
  }

  protected async onExecute(
    command: MakeMoneyTransferCommand,
  ): Promise<DomainNotificationResponse<MoneyTransfer>> {
    const { fromWalletId, toWalletId, amount } = command;

    const fromWallet = await this.walletsRepository.getById(fromWalletId);
    const toWallet = await this.walletsRepository.getById(toWalletId);

    const withdrawnNotice = fromWallet.withdrawMoney(amount);
    const depositNotice = toWallet.depositMoney(amount);

    const createdMoneyTransferNotice = await MoneyTransfer.create({
      amount,
      fromWalletId,
      toWalletId,
      type: MoneyMoneyTransferType.Transfer,
    });

    await Promise.all([
      this.walletsRepository.save(fromWallet),
      this.walletsRepository.save(toWallet),
      this.moneyTransferRepository.save(createdMoneyTransferNotice.data),
    ]);

    const domainNoticeResponse =
      DomainNotificationResponse.create(
        createdMoneyTransferNotice,
        withdrawnNotice,
        depositNotice,
      );

    return domainNoticeResponse;
  }
}
