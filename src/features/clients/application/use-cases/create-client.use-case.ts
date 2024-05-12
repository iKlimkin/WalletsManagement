import { Inject, Injectable } from '@nestjs/common';
import { ClientsRepository } from '../../infrastructure/clients.repository';
import { Client, CreateClientDTO } from '../../domain/entities/client.entity';

@Injectable()
export class CreateClientUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute(dto: CreateClientDTO) {
    const client = Client.createEntity(dto)
    
    await this.clientsRepository.save(client);

    return client
  }
}
