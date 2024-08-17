import { Injectable } from '@nestjs/common';
import { StoreType } from '../../config/local-storage.middleware';
import { AsyncLocalStorage } from 'node:async_hooks';

@Injectable()
export class StoreService {
  constructor(private als: AsyncLocalStorage<StoreType>) {}

  getStore(): StoreType {
    return this.als.getStore();
  }
}
