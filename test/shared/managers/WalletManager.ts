import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  CreateClientDTO,
  UpdateClientDTO,
} from '../../../src/features/clients/domain/entities/client.entity';
import { SuperTestBody } from '../bodyTypes';
import { NotificationResponse } from '../../../src/core/validation/notification';
import { WalletViewModel } from '../../../src/features/wallets/infrastructure/wallets.query.repository';
import { WalletsRouting } from '../../../src/infrastructure/routing/wallets.route';
import { CreateWalletCommand } from '../../../src/features/wallets/application/use-cases/create-wallet.use-case';
import { MakeMoneyTransferCommand } from '../../../src/features/wallets/application/use-cases/make-transfer.use-case';

type WalletViewType = NotificationResponse<{ item: WalletViewModel }>;

export class WalletManager {
  private readonly application = this.app.getHttpServer();
  constructor(
    private readonly app: INestApplication,
    protected readonly routing: WalletsRouting,
  ) {}

  async createWallet(
    command: CreateWalletCommand,
    expectStatus = HttpStatus.CREATED,
  ): Promise<WalletViewType> {
    let wallet: WalletViewType;

    await request(this.application)
      .post(this.routing.createOne())
      .send(command)
      .expect(expectStatus)
      .expect(({ body }: SuperTestBody<WalletViewType>) => {
        wallet = body;
      });

    return wallet!;
  }

  async makeMoneyTransfer(
    command: MakeMoneyTransferCommand,
    config?: { expectBody?; expectedStatus? },
  ) {
    let createdItem: any;

    await request(this.application)
      .post(this.routing.makeMoneyTransfer())
      .send(command)
      .expect(config?.expectedStatus ?? HttpStatus.CREATED)
      .expect(({ body }: SuperTestBody<WalletViewType>) => {
        createdItem = body;
      });

    return createdItem!;
  }

  async getWallet(
    id: string,
    expectStatus = HttpStatus.OK,
  ): Promise<WalletViewModel> {
    let wallet: WalletViewModel;
    await request(this.application)
      .get(this.routing.findOne(id))
      .expect(expectStatus)
      .expect(({ body }: SuperTestBody<WalletViewModel>) => {
        wallet = body;
      });

    return wallet!;
  }

  async getAndCheckWallet(
    id: string,
    config: {
      expectStatus?: number;
      expectModel: WalletViewModel;
    },
  ): Promise<WalletViewModel> {
    let wallet: WalletViewModel;
    await request(this.application)
      .get(this.routing.findOne(id))
      .expect(config.expectStatus ?? HttpStatus.OK)
      .expect(({ body }: SuperTestBody<WalletViewModel>) => {
        wallet = body;
      });

    this.checkModel(wallet!, config.expectModel);

    return wallet!;
  }

  async getWallets(expectStatus = HttpStatus.OK): Promise<WalletViewModel[]> {
    let wallets: WalletViewModel[];
    await request(this.application)
      .get(this.routing.findAll())
      .expect(expectStatus)
      .expect(({ body }: SuperTestBody<WalletViewModel[]>) => {
        wallets = body;
      });

    return wallets!;
  }

  async updateClientAndCheck(
    id: string,
    dto: Omit<UpdateClientDTO, 'id'>,
    expectStatus = HttpStatus.NO_CONTENT,
  ) {
    const walletBeforeUpdate = await this.getWallet(id);

    const response = await request(this.application)
      .patch(this.routing.updateOne(id))
      .send(dto)
      .expect(expectStatus);

    const walletAfterUpdate = await this.getWallet(id);

    response.statusCode === HttpStatus.NO_CONTENT &&
      this.checkModel(walletAfterUpdate, {
        ...walletBeforeUpdate,
        ...dto,
      });
  }

  async deleteClient(id: string, expectStatus = HttpStatus.NO_CONTENT) {
    const clientBefore = await this.getWallet(id);

    await request(this.application)
      .delete(this.routing.deleteOne(id))
      .expect(expectStatus);

    const clientAfter = await this.getWallet(id, HttpStatus.NOT_FOUND);
  }

  checkModel(responseModel: any, expectedModel: any): void {
    expect(responseModel).toEqual(expectedModel);
  }
}
