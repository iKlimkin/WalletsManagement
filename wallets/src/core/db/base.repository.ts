import { StoreService } from '../../features/clients/store.service';
import { BaseDomainEntity } from '../baseEntity';

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
    options: { lock: boolean } = { lock: false },
  ): Promise<T[]> {
    let selectQueryBuilder = this.getRepository().createQueryBuilder();
    if (options.lock) {
      selectQueryBuilder = selectQueryBuilder.setLock('pessimistic_write');
    }
    return await selectQueryBuilder.where(filter).getMany();
  }

  async save(entity: T): Promise<void> {
    await this.getRepository().save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.getRepository().delete(id);
  }

  private getRepository() {
    return this.storeService
      .getStore()
      .managerWrapper.getRepository<T>(this._class);
  }
}
