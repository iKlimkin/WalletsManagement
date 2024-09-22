import { BaseDomainEntity } from '../../../../core/entities/baseEntity';
import { Client } from '../../../clients/domain/entities/client/client.entity';
import { Wallet } from './wallet.entity';

export class WalletLimits extends BaseDomainEntity {
  perDay: number | null;
  perWeek: number | null;
  perMonth: number | null;
}
export class WalletSharing extends BaseDomainEntity {
  client: Client;
  wallet: Wallet;
  limits: WalletLimits;
}
