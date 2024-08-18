import { Injectable } from '@nestjs/common';

@Injectable()
export class WalletsService {
  create(createWalletDto: any) {
    return 'This action adds a new wallet';
  }

  findAll() {
    return `This action returns all wallets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: any) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
