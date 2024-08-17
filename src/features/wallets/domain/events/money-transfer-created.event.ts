import { MoneyMoneyTransferType } from '../entities/money-transfer.entity';

export class MoneyTransferCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly fromWalletId: string,
    public readonly toWalletId: string,
    public readonly withdrawAmount: number,
    public readonly depositAmount: number,
    public readonly type: MoneyMoneyTransferType,
  ) {}
}
