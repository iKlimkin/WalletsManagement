import { DomainNotificationResponse } from '../../../../../../core/validation/notification';
import { Wallet } from '../../../../../wallets/domain/entities/wallet.entity';
import { UpdatePassportCommand } from '../../../../dto/update-passport.command';
import { Client, ClientStatus } from '../client.entity';
import { ClientDeletedEvent } from '../events/client-deleted.event';
import { IClientStatusState } from './IClientStatusState';

export class ClientBlockedState implements IClientStatusState {
  updatePassport(command: UpdatePassportCommand) {
    throw new Error('');
  }

  constructor(private context: Client) {}

  delete(wallets: Wallet[]): DomainNotificationResponse<Client> {
    const domainResultNotification = new DomainNotificationResponse<Client>(
      this.context,
    );

    if (wallets.some((w) => w.balance > 0)) {
      domainResultNotification.addError(
        `You can't delete client with no 0 balance`,
        null,
        1,
      );
      return domainResultNotification;
    }
    this.context.status = ClientStatus.Deleted;
    domainResultNotification.addEvents(new ClientDeletedEvent(this.context.id));

    return domainResultNotification;
  }
}
