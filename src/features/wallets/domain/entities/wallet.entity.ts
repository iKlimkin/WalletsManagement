import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseDomainEntity } from '../../../../core/baseEntity';
import { Client } from '../../../clients/domain/entities/client.entity';
import { MoneyTransfer } from './money-transfer.entity';
import { WalletLimits, WalletSharing } from './wallet.types';

@Entity()
export class Wallet extends BaseDomainEntity {
  @ManyToOne(() => Client, (client) => client.wallets, { onDelete: 'CASCADE' })
  client: Client;

  @Column()
  clientId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  cardNumber: string;

  @Column()
  currency: CurrencyType;

  @Column()
  balance: number;

  // @Column()
  limits: WalletLimits;

  // @Column()
  sharing: WalletSharing[];

  @OneToMany(() => MoneyTransfer, (transaction) => transaction.toWallet, { onDelete: 'CASCADE' })
  inputMoneyTransfers: MoneyTransfer[];

  @OneToMany(() => MoneyTransfer, (transaction) => transaction.fromWallet, { onDelete: 'CASCADE' })
  outputMoneyTransfers: MoneyTransfer[];
}

export enum CurrencyType {
  USD,
  RUB,
  GEL,
  BTC,
  BYN,
  UAH,
}
