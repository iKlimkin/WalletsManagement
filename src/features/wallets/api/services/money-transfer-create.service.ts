import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BaseCrudApiService } from '../../../../core/api/services/base-crud-api.service';
import { MakeMoneyTransferCommand } from '../../application/use-cases/make-transfer.use-case';
import { MoneyTransfer } from '../../domain/entities/money-transfer.entity';
import { MoneyTransferQueryRepository, MoneyTransferViewModel } from '../../infrastructure/money-transfer.query.repository';

@Injectable()
export class MoneyTransferCrudApiService extends BaseCrudApiService<
  MoneyTransfer,
  MakeMoneyTransferCommand,
  MoneyTransferViewModel
> {
  constructor(commandBus: CommandBus, queryRepo: MoneyTransferQueryRepository) {
    super(commandBus, queryRepo);
  }
}
