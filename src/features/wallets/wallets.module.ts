import { Module } from '@nestjs/common';
import { WalletsService } from './application/wallets.service';
import { WalletsController } from './api/wallets.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './domain/entities/wallet.entity';
import { MoneyTransfer } from './domain/entities/money-transfer.entity';
import { CreateCreateWalletUseCase } from './application/use-cases/create-wallet.use-case';
import { WalletsRepository } from './infrastructure/wallets.repository';
import { WalletsQueryRepository } from './infrastructure/wallets.query.repository';
import { WalletsCrudApiService } from './api/services/wallets-crud.api.service';
import { MakeMoneyTransferUseCase } from './application/use-cases/make-transfer.use-case';
import { MoneyTransferRepository } from './infrastructure/money-transfer.repository';
import { MoneyTransferQueryRepository } from './infrastructure/money-transfer.query.repository';
import { MoneyTransferCrudApiService } from './api/services/money-transfer-create.service';
import { StoreService } from '../clients/store.service';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Wallet, MoneyTransfer])],
  controllers: [WalletsController],
  providers: [
    WalletsService,
    CreateCreateWalletUseCase,
    MakeMoneyTransferUseCase,
    WalletsRepository,
    WalletsQueryRepository,
    WalletsCrudApiService,
    MoneyTransferRepository,
    MoneyTransferQueryRepository,
    MoneyTransferCrudApiService,
    StoreService,
  ],
  exports: [],
})
export class WalletsModule {}
