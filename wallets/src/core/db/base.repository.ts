import { BaseDomainEntity } from '../entities/baseEntity';
import { StoreService } from '../infrastructure/adapters/store.service';

export interface IBaseRepository<T> {
  getById(id: string): Promise<T>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

export class BaseRepository<T extends BaseDomainEntity> {
  constructor(
    public storeService: StoreService,
    protected _class: any,
  ) {}

  async getById(id: string, options: { lock: boolean } = { lock: true }) {
    let selectQueryBuilder = this.getRepository().createQueryBuilder();
    if (options.lock) {
      selectQueryBuilder = selectQueryBuilder.setLock('pessimistic_write');
    }
    const entity = await selectQueryBuilder.where({ id }).getOne();
    return entity;
  }

  async getMany(
    filter: Partial<T>,
    options: { lock?: boolean; sortBy?: SortProperty<keyof T>[] } = {
      lock: false,
      sortBy: null,
    },
  ): Promise<T[]> {
    const finalizedOptions = {
      lock: false,
      sortBy: null,
      ...options,
    };
    let selectQueryBuilder = this.getRepository().createQueryBuilder();
    if (finalizedOptions.lock) {
      selectQueryBuilder = selectQueryBuilder.setLock('pessimistic_write');
    }
    selectQueryBuilder = selectQueryBuilder.where(filter);

    if (finalizedOptions.sortBy?.length) {
      const { propertyName, direction } = finalizedOptions.sortBy[0];
      selectQueryBuilder = selectQueryBuilder.orderBy(
        propertyName as string,
        direction,
      );
    }

    return await selectQueryBuilder.where(filter).getMany();
  }

  async save(entity: T): Promise<void> {
    await this.getRepository().save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.getRepository().delete(id);
  }

  protected getRepository() {
    return this.storeService
      .getStore()
      .managerWrapper.getRepository<T>(this._class);
  }
}

export type SortProperty<TPropertyName> = {
  propertyName: TPropertyName;
  direction: SortDirection;
};

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}
