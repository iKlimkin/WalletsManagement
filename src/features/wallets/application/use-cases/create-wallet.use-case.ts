import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationResponse } from '../../../../core/validation/notification';
import { CurrencyType, Wallet } from '../../domain/entities/wallet.entity';
import { WalletsRepository } from '../../infrastructure/wallets.repository';
import { IsString } from 'class-validator';

export class CreateWalletCommand {
  @IsString()
  clientId: string;
}

@CommandHandler(CreateWalletCommand)
export class CreateCreateWalletUseCase
  implements ICommandHandler<CreateWalletCommand>
{
  constructor(private walletsRepository: WalletsRepository) {}

  async execute(
    command: CreateWalletCommand,
  ): Promise<NotificationResponse<Wallet>> {
    const { clientId } = command;

    const wallet = new Wallet();
    wallet.id = crypto.randomUUID();
    wallet.title = 'USD';
    wallet.currency = CurrencyType.USD;
    wallet.balance = 100;
    wallet.clientId = clientId;

    await this.walletsRepository.save(wallet);

    return new NotificationResponse(wallet);
  }
}
