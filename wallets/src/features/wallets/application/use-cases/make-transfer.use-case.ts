import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { IsNumber, IsString } from 'class-validator';
import {
  DomainNotificationResponse,
  NotificationResponse,
} from '../../../../core/validation/notification';
import { StoreService } from '../../../../core/infrastructure/adapters/store.service';
import {
  MoneyMoneyTransferType,
  MoneyTransfer,
} from '../../domain/entities/money-transfer.entity';
import { MoneyTransferRepository } from '../../infrastructure/money-transfer.repository';
import { WalletsRepository } from '../../infrastructure/wallets.repository';
import { BaseUseCase } from '../../../../core/app/base-use-case';
import { BaseUseCaseServicesWrapper } from '../../../../core/infrastructure/base-use-cases-services.wrapper';

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
    baseUseCaseServicesWrapper: BaseUseCaseServicesWrapper,
  ) {
    super(baseUseCaseServicesWrapper);
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

    const domainNoticeResponse = DomainNotificationResponse.merge(
      createdMoneyTransferNotice,
      withdrawnNotice,
      depositNotice,
    );

    return domainNoticeResponse;
  }
}
