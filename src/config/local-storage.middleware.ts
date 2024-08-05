import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import { DataSource } from 'typeorm';
import { EntityManagerWrapper } from '../core/db/entity-manager.wrapper';

export type StoreType = { managerWrapper: EntityManagerWrapper };

export const asyncLocalStorage = new AsyncLocalStorage<StoreType>();

@Injectable()
export class AsyncStorageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const queryRunner = this.dataSource.createQueryRunner();
    const wrapper = new EntityManagerWrapper(queryRunner);

    asyncLocalStorage.run({ managerWrapper: wrapper }, () => next());
  }

  constructor(private dataSource: DataSource) {}
}
