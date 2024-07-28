import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseDomainEntity } from '../../../../core/baseEntity';
import { Wallet } from './wallet.entity';

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
}
export enum MoneyMoneyTransferType {
  Exchange = 0,
  Transfer = 1,
  Deposit = 2,
}
