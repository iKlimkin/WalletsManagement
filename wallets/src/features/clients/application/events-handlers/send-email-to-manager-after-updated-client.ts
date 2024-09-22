import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SmtpAdapter } from '../../../../core/infrastructure/adapters/smtp.adapter';
import { ClientsRepository } from '../../infrastructure/clients.repository';
import { ClientUpdatedEvent } from '../../domain/entities/client/events/client-updated.event';

@EventsHandler(ClientUpdatedEvent)
export class ClientUpdatedEventHandler
  implements IEventHandler<ClientUpdatedEvent>
{
  constructor(
    private smtpAdapter: SmtpAdapter,
    private clientsRepo: ClientsRepository,
  ) {}

  async handle(event: ClientUpdatedEvent) {
    const client = await this.clientsRepo.getById(event.clientId, {
      lock: false,
    });
    this.smtpAdapter.sendMail({
      to: client.firstName,
      subject: 'Your account has been updated',
      text: 'Your account has been updated successfully',
    });
  }
}
