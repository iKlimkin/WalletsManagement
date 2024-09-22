import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BaseCrudApiService } from '../../../../core/api/services/base-crud-api.service';
import { Client } from '../../../clients/domain/entities/client/client.entity';
import { CreateWalletCommand } from '../../application/use-cases/create-wallet.use-case';
import {
  WalletsQueryRepository,
  WalletViewModel,
} from '../../infrastructure/wallets.query.repository';

@Injectable()
export class WalletsCrudApiService extends BaseCrudApiService<
  Client,
  CreateWalletCommand,
  WalletViewModel
> {
  constructor(commandBus: CommandBus, queryRepo: WalletsQueryRepository) {
    super(commandBus, queryRepo);
  }
}
