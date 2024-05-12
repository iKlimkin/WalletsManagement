import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientsService {
  create(createClientDto: any) {
    return 'This action adds a new client';
  }

  findAll() {
    return `This action returns all clients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: any) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
