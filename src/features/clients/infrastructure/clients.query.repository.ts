import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Client } from '../domain/entities/client.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Injectable()
export class ClientsQueryRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Client) private ormRepo: Repository<Client>,
  ) {}
  async getAll(): Promise<ClientViewModel[]> {
    const result = await this.ormRepo.find();
    return result.map(ClientsQueryRepository.mapClientEntityToClientViewModel);
  }

  async getById(id: string): Promise<ClientViewModel> {
    const entity = await this.ormRepo.findOneBy({ id });
    return ClientsQueryRepository.mapClientEntityToClientViewModel(entity);
  }

  static mapClientEntityToClientViewModel = (
    client: Client,
  ): ClientViewModel => ({
    id: client.id,
    firstName: client.firstName,
    lastName: client.lastName,
  });
}

export class ClientViewModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
