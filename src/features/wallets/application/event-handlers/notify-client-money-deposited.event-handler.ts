import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SmtpAdapter } from '../../../../core/infrastructure/adapters/smtp.adapter';
import { NotifyClientMoneyDepositedEvent } from '../../domain/events/notify-client-money-deposited.event';

@EventsHandler(NotifyClientMoneyDepositedEvent)
export class NotifyClientMoneyDepositedEventHandler
  implements IEventHandler<NotifyClientMoneyDepositedEvent>
{
  constructor(private smtpAdapter: SmtpAdapter) {}

  async handle(event: NotifyClientMoneyDepositedEvent) {
    this.smtpAdapter.sendMail({
      to: 'client.email',
      subject: 'Your account has been updated',
      text: 'Your account has been updated successfully',
    });
  }
}
