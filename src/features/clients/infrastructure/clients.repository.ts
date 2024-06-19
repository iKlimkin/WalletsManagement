import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../domain/entities/client.entity';

export interface BaseRepository<T> {
  getById(id: string): Promise<T>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

@Injectable()
export class ClientsRepository implements BaseRepository<Client> {
  constructor(
    @InjectRepository(Client) private readonly clientsRepo: Repository<Client>,
  ) {}

  async getById(id: string): Promise<Client> {
    return this.clientsRepo.findOneBy({ id });
  }

  async save(client: Client): Promise<void> {
    await this.clientsRepo.save(client);
  }

  async delete(id: string): Promise<void> {
    await this.clientsRepo.delete(id);
  }
}
