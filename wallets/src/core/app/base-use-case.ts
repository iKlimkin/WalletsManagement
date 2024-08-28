import { DomainNotificationResponse } from '../../core/validation/notification';
import { OutboxEvent } from '../entities/outbox-event.entity';
import { BaseUseCaseServicesWrapper } from '../infrastructure/base-use-cases-services.wrapper';

export abstract class BaseUseCase<TInputCommand, TOutputNotificationResponse> {
  protected constructor(
    private readonly baseUseCaseServicesWrapper: BaseUseCaseServicesWrapper,
  ) {}

  protected abstract onExecute(
    command: TInputCommand,
  ): Promise<DomainNotificationResponse<TOutputNotificationResponse>>;

  async execute(
    command: TInputCommand,
  ): Promise<DomainNotificationResponse<TOutputNotificationResponse>> {
    return await this.launchTransaction(command);
  }

  private async launchTransaction(
    data: TInputCommand,
  ): Promise<DomainNotificationResponse<TOutputNotificationResponse>> {
    const { storeService, outboxRepository, eventBus } =
      this.baseUseCaseServicesWrapper;
    const queryRunner = storeService.getStore().managerWrapper.queryRunner;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const resultNotification = await this.onExecute(data);
      if (resultNotification.hasError) {
        await queryRunner.rollbackTransaction();
      } else {
        const savedEvents = resultNotification.events.map((e) => {
          const event = new OutboxEvent();
          event.serviceName = 'shop';
          event.eventName = e.constructor.name;
          event.data = e;
          return outboxRepository.save(event);
        });
        await Promise.all(savedEvents);
        await queryRunner.commitTransaction();
        resultNotification.events.forEach((e) => eventBus.publish(e));
      }
      return resultNotification;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error('Transaction failed: ' + error);
    } finally {
      await queryRunner.release();
    }
  }
}
