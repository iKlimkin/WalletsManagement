import { QueryRunner, Repository } from 'typeorm';

export class EntityManagerWrapper {
  private repos: Repository<any>[] = [];
  constructor(public queryRunner: QueryRunner) {}

  getRepository<T>(_class: any): Repository<T> {
    const repo = this.queryRunner.manager.getRepository<T>(_class);
    this.repos.push(repo);
    return repo;
  }
}
