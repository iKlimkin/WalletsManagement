import { Client, ClientStatus } from '../client.entity';
import { Wallet } from '../../../../../wallets/domain/entities/wallet.entity';
import { ClientDeletedEvent } from '../events/client-deleted.event';
import { IClientStatusState } from './IClientStatusState';
import { DomainNotificationResponse } from '../../../../../../core/validation/notification';
import { UpdatePassportCommand } from '../../../../dto/update-passport.command';

export class ClientNewState implements IClientStatusState {
  updatePassport(command: UpdatePassportCommand) {
    this.context.passportData.serial = command.serial;
    this.context.passportData.number = command.number;
    this.context.passportData.issueDate = command.issueDate;
  }

  constructor(private context: Client) {}

  delete(wallets: Wallet[]): DomainNotificationResponse<Client> {
    const domainResultNotification = new DomainNotificationResponse<Client>(
      this.context,
    );

    this.context.status = ClientStatus.Deleted;
    domainResultNotification.addEvents(new ClientDeletedEvent(this.context.id));

    return domainResultNotification;
  }
}
