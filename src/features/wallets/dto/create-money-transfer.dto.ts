import { MoneyMoneyTransferType } from '../domain/entities/money-transfer.entity';

export class CreateMoneyTransferDTO {
  public fromWalletId: string;
  public toWalletId: string;
  public amount: number;
  public type: MoneyMoneyTransferType;
}
