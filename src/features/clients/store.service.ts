import { Injectable } from '@nestjs/common';
import {
  asyncLocalStorage,
  StoreType,
} from '../../config/local-storage.middleware';

@Injectable()
export class StoreService {
  getStore(): StoreType {
    return asyncLocalStorage.getStore();
  }
}
