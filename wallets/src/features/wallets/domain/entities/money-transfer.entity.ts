import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseDomainEntity } from '../../../../core/entities/baseEntity';
import { Wallet } from './wallet.entity';
import { MoneyTransferCreatedEvent } from '../events/money-transfer-created.event';
import { validateEntity } from '../../../../core/validation/validation-utils';
import { CreateMoneyTransferDTO } from '../../dto/create-money-transfer.dto';
import { DomainNotificationResponse } from '../../../../core/validation/notification';

@Entity()
export class MoneyTransfer extends BaseDomainEntity {
  @ManyToOne(() => Wallet, (wallet) => wallet.outputMoneyTransfers)
  fromWallet: Wallet;

  @Column()
  fromWalletId: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.inputMoneyTransfers)
  toWallet: Wallet;

  @Column()
  toWalletId: string;

  @Column()
  withdrawAmount: number;

  @Column()
  depositAmount: number;

  @Column()
  type: MoneyMoneyTransferType;

  static async create(
    moneyTransferDto: CreateMoneyTransferDTO,
  ): Promise<DomainNotificationResponse<MoneyTransfer>> {
    const { fromWalletId, toWalletId, amount } = moneyTransferDto;
    const moneyTransfer = new MoneyTransfer();

    const notification = new DomainNotificationResponse<MoneyTransfer>();

    if (
      moneyTransferDto.amount > 1000 &&
      moneyTransferDto.fromWalletId === 'id34344...'
    ) {
      notification.addError(
        'impossible make transfer more then 1000 for superAdmin',
        'amount',
        14,
      );
      return notification;
    }

    moneyTransfer.id = crypto.randomUUID();
    moneyTransfer.fromWalletId = fromWalletId;
    moneyTransfer.toWalletId = toWalletId;
    moneyTransfer.withdrawAmount = amount;
    moneyTransfer.depositAmount = amount;
    moneyTransfer.type = MoneyMoneyTransferType.Transfer;

    const transferCreatedEvent = new MoneyTransferCreatedEvent(
      moneyTransfer.id,
      moneyTransfer.fromWalletId,
      moneyTransfer.toWalletId,
      moneyTransfer.withdrawAmount,
      moneyTransfer.depositAmount,
      moneyTransfer.type,
    );

    return validateEntity(moneyTransfer, [transferCreatedEvent]);
  }
}
export enum MoneyMoneyTransferType {
  Exchange = 0,
  Transfer = 1,
  Deposit = 2,
}
