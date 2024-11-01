import { DomainEvent } from '../../../../../../core/app/domain/domain-event';
import { UpdateClientDTO } from '../../../../dto/update-client.dto';

export class ClientUpdatedEvent extends DomainEvent {
  static type = 'finance/wallet/client-updated';
  public clientId: string;

  public firstName?: string;
  public lastName?: string;
  public address?: string | null;

  constructor(clientId: string, command: UpdateClientDTO) {
    super(ClientUpdatedEvent.type);
    this.clientId = clientId;

    if (typeof command.address !== 'undefined') {
      this.address = command.address;
    }
    if (command.firstName) {
      this.lastName = command.firstName;
    }
    if (command.lastName) {
      this.lastName = command.lastName;
    }
  }
}
