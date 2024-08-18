import { EventBus } from '@nestjs/cqrs';
import { DomainNotificationResponse } from '../../core/validation/notification';
import { StoreService } from '../../features/clients/store.service';

export abstract class BaseUseCase<TInputCommand, TOutputNotificationResponse> {
  protected constructor(
    protected readonly storeService: StoreService,
    protected eventBus: EventBus,
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
    const queryRunner = this.storeService.getStore().managerWrapper.queryRunner;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const resultNotification = await this.onExecute(data);
      if (resultNotification.hasError) {
        await queryRunner.rollbackTransaction();
      } else {
        await queryRunner.commitTransaction();
        resultNotification.events.forEach((e) => this.eventBus.publish(e));
      }
      return resultNotification;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error('Transaction failed');
    } finally {
      await queryRunner.release();
    }
  }
}
