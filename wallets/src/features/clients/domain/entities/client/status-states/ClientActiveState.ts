import { Client, ClientStatus } from '../client.entity';
import { Wallet } from '../../../../../wallets/domain/entities/wallet.entity';
import { IClientStatusState } from './IClientStatusState';
import { UpdatePassportCommand } from '../../../../dto/update-passport.command';
import { DomainNotificationResponse } from '../../../../../../core/validation/notification';

export class ClientActiveState implements IClientStatusState {
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

    domainResultNotification.addError("Can't be deleted");

    return domainResultNotification;
  }
}
