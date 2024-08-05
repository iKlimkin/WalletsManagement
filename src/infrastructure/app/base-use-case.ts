import { NotificationResponse } from '../../core/validation/notification';
import { StoreService } from '../../features/clients/store.service';

export abstract class BaseUseCase<TInputCommand, TOutputNotificationResponse> {
  protected constructor(private readonly storeService: StoreService) {}

  protected abstract onExecute(
    command: TInputCommand, // entityManager: EntityManager,
  ): Promise<NotificationResponse<TOutputNotificationResponse>>;

  async execute(
    command: TInputCommand,
  ): Promise<NotificationResponse<TOutputNotificationResponse>> {
    return await this.launchTransaction(command);
  }

  private async launchTransaction(
    data: TInputCommand,
  ): Promise<NotificationResponse<TOutputNotificationResponse>> {
    const queryRunner = this.storeService.getStore().managerWrapper.queryRunner;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this.onExecute(data);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error('Transaction failed');
    } finally {
      await queryRunner.release();
    }
  }
}
