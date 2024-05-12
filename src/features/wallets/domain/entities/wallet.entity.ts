import { BaseDomainEntity } from '../../../../core/baseEntity';
import { Client } from '../../../clients/domain/entities/client.entity';

export class Wallet extends BaseDomainEntity {
  title: string;
  cardNumber: string;
  currency: CurrencyType;
  balance: number;
  limits: WalletLimits;
  sharing: WalletSharing[];
}

class WalletLimits extends BaseDomainEntity {
  perDay: number | null;
  perWeek: number | null;
  perMonth: number | null;
}

class WalletSharing extends BaseDomainEntity {
  client: Client;
  wallet: Wallet;
  limits: WalletLimits;
}

enum CurrencyType {
  USD,
  RUB,
  GEL,
  BTC,
  BYN,
  UAH,
}
