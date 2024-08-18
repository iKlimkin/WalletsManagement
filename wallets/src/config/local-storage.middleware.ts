import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import { DataSource } from 'typeorm';
import { EntityManagerWrapper } from '../core/db/entity-manager.wrapper';

export type StoreType = { managerWrapper: EntityManagerWrapper };

@Injectable()
export class AsyncStorageMiddleware implements NestMiddleware {
  constructor(
    private dataSource: DataSource,
    private als: AsyncLocalStorage<StoreType>,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const queryRunner = this.dataSource.createQueryRunner();
    const wrapper = new EntityManagerWrapper(queryRunner);
    const store = { managerWrapper: wrapper };

    this.als.run(store, () => next());
  }
}
