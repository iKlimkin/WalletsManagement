import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SmtpAdapter } from '../../../../core/infrastructure/adapters/smtp.adapter';
import { NotifyClientMoneyWithdrawnEvent } from '../../domain/events/notify-client-money-withdrawn.event';

@EventsHandler(NotifyClientMoneyWithdrawnEvent)
export class NotifyClientMoneyWithdrawnEventHandler
  implements IEventHandler<NotifyClientMoneyWithdrawnEvent>
{
  constructor(private smtpAdapter: SmtpAdapter) {}

  async handle(event: NotifyClientMoneyWithdrawnEvent) {
    this.smtpAdapter.sendMail({
      to: 'client.email',
      subject: 'Your account has been updated',
      text: 'Your account has been updated successfully',
    });
  }
}
