import { DomainNotificationResponse } from '../../../../../../core/validation/notification';
import { Wallet } from '../../../../../wallets/domain/entities/wallet.entity';
import { UpdatePassportCommand } from '../../../../dto/update-passport.command';
import { ClientStatus, Client } from '../client.entity';
import { ClientDeletedEvent } from '../events/client-deleted.event';
import { IClientStatusState } from './IClientStatusState';

export class ClientRejectedState implements IClientStatusState {
  updatePassport(command: UpdatePassportCommand) {
    this.context.passportData.serial = command.serial;
    this.context.passportData.number = command.number;
    this.context.passportData.issueDate = command.issueDate;

    this.context.status = ClientStatus.OnVerification;
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
