import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseDomainEntity } from '../../../../core/baseEntity';
import { DomainNotificationResponse } from '../../../../core/validation/notification';
import { Client } from '../../../clients/domain/entities/client.entity';
import { MoneyDepositedEvent } from '../events/money-deposited.event';
import { MoneyWithdrawEvent } from '../events/money-withdrawn.event';
import { MoneyTransfer } from './money-transfer.entity';
import { WalletLimits, WalletSharing } from './wallet.types';
import { validateEntity } from '../../../../core/validation/validation-utils';
import { WalletCreatedEvent } from '../events/created-wallet.event';
import { CreateWalletCommand } from '../../application/use-cases/create-wallet.use-case';

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

  @OneToMany(() => MoneyTransfer, (transaction) => transaction.toWallet, {
    onDelete: 'CASCADE',
  })
  inputMoneyTransfers: MoneyTransfer[];

  @OneToMany(() => MoneyTransfer, (transaction) => transaction.fromWallet, {
    onDelete: 'CASCADE',
  })
  outputMoneyTransfers: MoneyTransfer[];

  static async create(
    createDTO: CreateWalletCommand,
  ): Promise<DomainNotificationResponse<Wallet>> {
    const wallet = new Wallet();
    wallet.id = crypto.randomUUID();
    wallet.title = 'USD';
    wallet.currency = CurrencyType.USD;
    wallet.balance = 100;
    wallet.clientId = createDTO.clientId;

    const walletCreatedEvent = new WalletCreatedEvent(
      wallet.id,
      wallet.title,
      wallet.currency,
      wallet.balance,
      wallet.clientId,
    );

    return validateEntity(wallet, [walletCreatedEvent]);
  }

  withdrawMoney(amount: number): DomainNotificationResponse {
    const notification = new DomainNotificationResponse();
    if (this.balance < amount) {
      notification.addError('Not enough money');
      return notification;
    }
    this.balance -= amount;
    const moneyWithdrawEvent = new MoneyWithdrawEvent(this.id, amount);
    notification.addEvents([moneyWithdrawEvent]);
    return notification;
  }

  depositMoney(amount: number): DomainNotificationResponse {
    const notification = new DomainNotificationResponse();
    this.balance += amount;
    const moneyDepositedEvent = new MoneyDepositedEvent(this.id, amount);
    notification.addEvents([moneyDepositedEvent]);
    return notification;
  }
}

export enum CurrencyType {
  USD,
  RUB,
  GEL,
  BTC,
  BYN,
  UAH,
}
