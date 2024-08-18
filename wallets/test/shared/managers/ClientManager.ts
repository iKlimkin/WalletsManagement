import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ClientViewModel } from '../../../src/features/clients/infrastructure/clients.query.repository';
import { ClientsAdminRouting } from '../../../src/infrastructure/routing/clients.route';
import { SuperTestBody } from '../bodyTypes';
import { NotificationResponse } from '../../../src/core/validation/notification';
import { CreateClientDTO } from '../../../src/features/clients/dto/create-client.dto';
import { UpdateClientDTO } from '../../../src/features/clients/dto/update-client.dto';

type ClientViewType = NotificationResponse<{ item: ClientViewModel }>;

export class ClientManager {
  private readonly application = this.app.getHttpServer();
  constructor(
    private readonly app: INestApplication,
    protected readonly routing: ClientsAdminRouting,
  ) {}

  async createClient(
    dto: CreateClientDTO,
    expectStatus = HttpStatus.CREATED,
  ): Promise<NotificationResponse<{ item: ClientViewModel }>> {
    let client: ClientViewType;

    await request(this.application)
      .post(this.routing.createOne())
      .send(dto)
      .expect(expectStatus)
      .expect(({ body }: SuperTestBody<ClientViewType>) => {
        client = body;
      });

    return client!;
  }

  async getClient(
    id: string,
    expectStatus = HttpStatus.OK,
  ): Promise<ClientViewModel> {
    let client: ClientViewModel;
    await request(this.application)
      .get(this.routing.findOne(id))
      .expect(expectStatus)
      .expect(({ body }: SuperTestBody<ClientViewModel>) => {
        client = body;
      });

    return client!;
  }

  async getAndCheckClient(
    id: string,
    config: {
      expectStatus?: number;
      expectModel: ClientViewModel;
    },
  ): Promise<ClientViewModel> {
    let client: ClientViewModel;
    await request(this.application)
      .get(this.routing.findOne(id))
      .expect(config.expectStatus ?? HttpStatus.OK)
      .expect(({ body }: SuperTestBody<ClientViewModel>) => {
        client = body;
      });

    this.checkModel(client!, config.expectModel);

    return client!;
  }

  async getClients(expectStatus = HttpStatus.OK): Promise<ClientViewModel[]> {
    let clients: ClientViewModel[];
    await request(this.application)
      .get(this.routing.findAll())
      .expect(expectStatus)
      .expect(({ body }: SuperTestBody<ClientViewModel[]>) => {
        clients = body;
      });

    return clients!;
  }

  async updateClientAndCheck(
    id: string,
    dto: Omit<UpdateClientDTO, 'id'>,
    expectStatus = HttpStatus.NO_CONTENT,
  ) {
    const clientBeforeUpdate = await this.getClient(id);

    const response = await request(this.application)
      .patch(this.routing.updateOne(id))
      .send(dto)
      .expect(expectStatus);

    const clientAfterUpdate = await this.getClient(id);

    response.statusCode === HttpStatus.NO_CONTENT &&
      this.checkModel(clientAfterUpdate, {
        ...clientBeforeUpdate,
        ...dto,
      });
  }

  async deleteClient(id: string, expectStatus = HttpStatus.NO_CONTENT) {
    const clientBefore = await this.getClient(id);

    await request(this.application)
      .delete(this.routing.deleteOne(id))
      .expect(expectStatus);

    const clientAfter = await this.getClient(id, HttpStatus.NOT_FOUND);
  }

  checkModel(responseModel: any, expectedModel: any): void {
    expect(responseModel).toEqual(expectedModel);
  }
}
