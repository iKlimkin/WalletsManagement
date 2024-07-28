import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseRepository } from '../../../core/db/base.query.repository';
import { MoneyTransfer } from '../domain/entities/money-transfer.entity';

@Injectable()
export class MoneyTransferRepository implements BaseRepository<MoneyTransfer> {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(MoneyTransfer)
    private ormRepo: Repository<MoneyTransfer>,
  ) {}

  async save(entity: MoneyTransfer) {
    try {
      await this.ormRepo.save(entity);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getById(id: string): Promise<MoneyTransfer> {
    try {
      return await this.ormRepo.findOneBy({ id });
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete(id);
  }
}
