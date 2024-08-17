import { ClientStatus } from '../entities/client.entity';

export class ClientCreatedEvent {
  constructor(
    public clientId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly status: ClientStatus,
    public readonly address?: string,
  ) {}
}
