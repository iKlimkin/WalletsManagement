import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../core/db/base.repository';
import { StoreService } from '../../clients/store.service';
import { Wallet } from '../domain/entities/wallet.entity';

@Injectable()
export class WalletsRepository extends BaseRepository<Wallet> {
  constructor(public storeService: StoreService) {
    super(storeService, Wallet);
  }
}
