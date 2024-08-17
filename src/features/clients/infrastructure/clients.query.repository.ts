import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../core/db/base.query.repository';
import { Client } from '../domain/entities/client.entity';

@Injectable()
export class ClientsQueryRepository
  implements BaseQueryRepository<ClientViewModel>
{
  constructor(@InjectRepository(Client) private ormRepo: Repository<Client>) {}
  async getAll(): Promise<ClientViewModel[]> {
    const result = await this.ormRepo.find();
    return result.map(ClientsQueryRepository.mapClientEntityToClientViewModel);
  }

  async getById(id: string): Promise<ClientViewModel> {
    try {
      const entity = await this.ormRepo.findOneBy({ id });
      return ClientsQueryRepository.mapClientEntityToClientViewModel(entity);
    } catch (error) {
      return null;
    }
  }

  static mapClientEntityToClientViewModel = (client: Client): ClientViewModel =>
    ({
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      address: client.address,
    }) || null;
}

export class ClientViewModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  address: string;
}
