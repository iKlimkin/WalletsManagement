export interface BaseQueryRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T>;
}
