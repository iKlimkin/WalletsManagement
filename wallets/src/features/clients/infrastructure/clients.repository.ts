import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../core/db/base.repository';
import { Client } from '../domain/entities/client.entity';
import { StoreService } from '../store.service';

@Injectable()
export class ClientsRepository extends BaseRepository<Client> {
  constructor(public storeService: StoreService) {
    super(storeService, Client);
  }
}
