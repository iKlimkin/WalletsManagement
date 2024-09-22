import { Client } from '../client.entity';
import { Wallet } from '../../../../../wallets/domain/entities/wallet.entity';
import { IClientStatusState } from './IClientStatusState';
import { DomainNotificationResponse } from '../../../../../../core/validation/notification';
import { UpdatePassportCommand } from '../../../../dto/update-passport.command';

export class ClientOnVerificationState implements IClientStatusState {
  updatePassport(command: UpdatePassportCommand) {
    throw new Error('');
  }

  constructor(private context: Client) {}

  delete(wallets: Wallet[]): DomainNotificationResponse<Client> {
    const domainResultNotification = new DomainNotificationResponse<Client>(
      this.context,
    );
    domainResultNotification.addError(`Can't be deleted`);
    return domainResultNotification;
  }
}
