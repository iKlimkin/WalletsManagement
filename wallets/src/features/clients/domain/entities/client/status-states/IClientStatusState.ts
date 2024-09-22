import { Client } from '../client.entity';
import { Wallet } from '../../../../../wallets/domain/entities/wallet.entity';
import { DomainNotificationResponse } from '../../../../../../core/validation/notification';
import { UpdatePassportCommand } from '../../../../dto/update-passport.command';

export interface IClientStatusState {
  updatePassport(command: UpdatePassportCommand): void;
  delete(wallets: Wallet[]): DomainNotificationResponse<Client>;
}
