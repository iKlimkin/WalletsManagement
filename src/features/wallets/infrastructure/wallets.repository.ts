import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseRepository } from '../../../core/db/base.query.repository';
import { Wallet } from '../domain/entities/wallet.entity';

@Injectable()
export class WalletsRepository implements BaseRepository<Wallet> {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Wallet) private ormRepo: Repository<Wallet>,
  ) {}

  async save(entity: Wallet) {
    try {
      await this.ormRepo.save(entity);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getById(id: string): Promise<Wallet> {
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
