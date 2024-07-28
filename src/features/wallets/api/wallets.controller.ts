import { CommandBus } from '@nestjs/cqrs';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WalletsService } from '../application/wallets.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';
import { MakeMoneyTransferCommand } from '../application/use-cases/make-transfer.use-case';
import { WalletsCrudApiService } from './services/wallets-crud.api.service';
import { CreateWalletCommand } from '../application/use-cases/create-wallet.use-case';
import { WalletsQueryRepository } from '../infrastructure/wallets.query.repository';
import { MoneyTransferQueryRepository } from '../infrastructure/money-transfer.query.repository';
import { MoneyTransferCrudApiService } from './services/money-transfer-create.service';

@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly walletsQueryRepo: WalletsQueryRepository,
    private readonly walletsCrudApiService: WalletsCrudApiService,
    private readonly moneyTransferQueryRepo: MoneyTransferQueryRepository,
    private readonly moneyTransferCrudApiService: MoneyTransferCrudApiService,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('transaction')
  makeMoneyTransfer(@Body() command: MakeMoneyTransferCommand) {
    return this.moneyTransferCrudApiService.create(command);
  }

  @Post()
  create(@Body() command: CreateWalletCommand) {
    return this.walletsCrudApiService.create(command);
  }

  @Get()
  findAll() {
    return this.walletsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletsQueryRepo.getById(id);
  }

  @Get(':id')
  findOneMoneyTransfer(@Param('id') id: string) {
    return this.moneyTransferQueryRepo.getById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletsService.update(+id, updateWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletsService.remove(+id);
  }
}
