import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlsModule } from '../../als-module/als.module';
import { StoreService } from '../clients/store.service';
import { MoneyTransferCrudApiService } from './api/services/money-transfer-create.service';
import { WalletsCrudApiService } from './api/services/wallets-crud.api.service';
import { WalletsController } from './api/wallets.controller';
import { NotifyClientMoneyDepositedEventHandler } from './application/event-handlers/notify-client-money-deposited.event-handler';
import { NotifyClientMoneyWithdrawnEventHandler } from './application/event-handlers/notify-client-money-withdrawn.event-handler';
import { CreateWalletUseCase } from './application/use-cases/create-wallet.use-case';
import { MakeMoneyTransferUseCase } from './application/use-cases/make-transfer.use-case';
import { WalletsService } from './application/wallets.service';
import { MoneyTransfer } from './domain/entities/money-transfer.entity';
import { Wallet } from './domain/entities/wallet.entity';
import { MoneyTransferQueryRepository } from './infrastructure/money-transfer.query.repository';
import { MoneyTransferRepository } from './infrastructure/money-transfer.repository';
import { WalletsQueryRepository } from './infrastructure/wallets.query.repository';
import { WalletsRepository } from './infrastructure/wallets.repository';

@Module({
  imports: [
    CqrsModule,
    AlsModule,
    TypeOrmModule.forFeature([Wallet, MoneyTransfer]),
  ],
  controllers: [WalletsController],
  providers: [
    WalletsService,
    CreateWalletUseCase,
    MakeMoneyTransferUseCase,
    WalletsRepository,
    WalletsQueryRepository,
    WalletsCrudApiService,
    MoneyTransferRepository,
    MoneyTransferQueryRepository,
    MoneyTransferCrudApiService,
    NotifyClientMoneyWithdrawnEventHandler,
    NotifyClientMoneyDepositedEventHandler,
    StoreService,
  ],
  exports: [WalletsRepository, ],
})
export class WalletsModule {}
