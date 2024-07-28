import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../core/db/base.repository';
import { MoneyTransfer } from '../domain/entities/money-transfer.entity';

@Injectable()
export class MoneyTransferQueryRepository
  implements BaseQueryRepository<MoneyTransferViewModel>
{
  constructor(
    @InjectRepository(MoneyTransfer)
    private ormRepo: Repository<MoneyTransfer>,
  ) {}

  async getById(id: string): Promise<MoneyTransferViewModel> {
    try {
      const entity = await this.ormRepo.findOneBy({ id });
      if (!entity) return null;
      
      return MoneyTransferQueryRepository.mapEntityToViewModel(entity);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async getAll(): Promise<MoneyTransferViewModel[]> {
    try {
      const entities = await this.ormRepo.find();
      return entities.map(MoneyTransferQueryRepository.mapEntityToViewModel);
    } catch (error) {}
  }

  static mapEntityToViewModel = (
    entity: MoneyTransfer,
  ): MoneyTransferViewModel =>
    ({
      id: entity.id,
      fromWalletId: entity.fromWalletId,
      toWalletId: entity.toWalletId,
      withdrawAmount: entity.withdrawAmount,
      depositAmount: entity.depositAmount,
    }) || null;
}

export class MoneyTransferViewModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  fromWalletId: string;
  @ApiProperty()
  toWalletId: string;
  @ApiProperty()
  withdrawAmount: number;
  @ApiProperty()
  depositAmount: number;
}
