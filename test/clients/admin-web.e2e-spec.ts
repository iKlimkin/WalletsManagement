import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getAppForE2ETesting } from '../shared/tests.utils';
import {
  Client,
  CreateClientDTO,
} from '../../src/features/clients/domain/entities/client.entity';

enum NavigateEnum {
  clients = '/clients',
}

describe('ClientsController (e2e)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  const navigateClients = NavigateEnum.clients;

  beforeAll(async () => {
    const settings = await getAppForE2ETesting();
    app = settings.app;
    httpServer = settings.httpServer;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/clients (GET)', async () => {
    return request(httpServer).get(navigateClients).expect(200).expect([]);
  });
  it('/clients (POST)', async () => {
    const dto: CreateClientDTO = Client.createEntity({
      firstName: 'firstName',
      lastName: 'lastName',
    });

    const expectedCreatedClient = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      id: expect.any(String),
    };

    const result = await request(httpServer)
      .post(navigateClients)
      .send(dto)
      .expect(HttpStatus.CREATED);

    expect(result.body).toEqual(expectedCreatedClient);
  });
});
