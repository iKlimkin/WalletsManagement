import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../core/db/base.query.repository';
import { Wallet } from '../domain/entities/wallet.entity';

@Injectable()
export class WalletsQueryRepository
  implements BaseQueryRepository<WalletViewModel>
{
  constructor(@InjectRepository(Wallet) private ormRepo: Repository<Wallet>) {}
  async getAll(): Promise<WalletViewModel[]> {
    const result = await this.ormRepo.find();
    return result.map(WalletsQueryRepository.mapEntityToViewModel);
  }

  async getById(id: string): Promise<WalletViewModel> {
    try {
      const entity = await this.ormRepo.findOneBy({ id });
      return WalletsQueryRepository.mapEntityToViewModel(entity);
    } catch (error) {
      return null;
    }
  }

  static mapEntityToViewModel = (entity: Wallet): WalletViewModel =>
    ({
      id: entity.id,
      title: entity.title,
      balance: entity.balance,
    }) || null;
}

export class WalletViewModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  balance: number;
}
