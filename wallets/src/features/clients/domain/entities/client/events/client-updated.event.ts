import { UpdateClientCommand } from '../../../../application/use-cases/update-client.use-case';

export class ClientUpdatedEvent {
  public firstName?: string;
  public lastName?: string;
  public address?: string;
  constructor(
    public readonly clientId: string,
    private command: UpdateClientCommand,
  ) {
    const { dto } = this.command;
    if (dto.address) this.address = dto.address;
    if (dto.firstName) this.firstName = dto.firstName;
    if (dto.lastName) this.lastName = dto.lastName;
  }
}
