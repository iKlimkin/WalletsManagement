import { CommandHandler } from '@nestjs/cqrs';
import { IsNumber, IsString } from 'class-validator';
import { NotificationResponse } from '../../../../core/validation/notification';
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
    storeService: StoreService,
  ) {
    super(storeService);
  }

  protected async onExecute(
    command: MakeMoneyTransferCommand,
  ): Promise<NotificationResponse<MoneyTransfer>> {
    const { fromWalletId, toWalletId, amount } = command;

    const fromWallet = await this.walletsRepository.getById(fromWalletId);
    const toWallet = await this.walletsRepository.getById(toWalletId);

    fromWallet.balance -= amount;
    toWallet.balance += amount;

    const moneyTransfer = new MoneyTransfer();
    moneyTransfer.id = crypto.randomUUID();
    moneyTransfer.fromWalletId = fromWalletId;
    moneyTransfer.toWalletId = toWalletId;
    moneyTransfer.withdrawAmount = amount;
    moneyTransfer.depositAmount = amount;
    moneyTransfer.type = MoneyMoneyTransferType.Transfer;

    await Promise.all([
      this.walletsRepository.save(fromWallet),
      this.walletsRepository.save(toWallet),
      this.moneyTransferRepository.save(moneyTransfer),
    ]);

    return new NotificationResponse(moneyTransfer);
  }
}
