import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  Client,
  CreateClientDTO,
  UpdateClientDTO,
} from '../../src/features/clients/domain/entities/client.entity';
import { SuperTestBody } from '../shared/bodyTypes';
import { getAppForE2ETesting } from '../shared/tests.utils';
import { ClientManager } from '../shared/managers/ClientManager';
import { ClientsAdminRouting } from '../../src/infrastructure/routing/clients.route';
import { last } from 'rxjs';

export enum NavigateEnum {
  clients = '/clients',
}

describe('ClientsController.admin.web (e2e)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let clientsAdminRouting: ClientsAdminRouting;
  const navigateClients = NavigateEnum.clients;
  let clientsManager: ClientManager;

  beforeAll(async () => {
    const settings = await getAppForE2ETesting();
    app = settings.app;
    httpServer = settings.httpServer;
    clientsAdminRouting = new ClientsAdminRouting();

    clientsManager = new ClientManager(app, clientsAdminRouting);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/clients (GET)', async () => {
    return request(httpServer).get(navigateClients).expect(200).expect([]);
  });
  it('/clients (POST / GET)', async () => {
    const dto: CreateClientDTO = Client.createEntity({
      firstName: 'firstName',
      lastName: 'lastName',
    });

    const expectedCreatedClient = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      address: null,
      id: expect.any(String),
    };

    const createdClient = await clientsManager.createClient(dto);

    const client = await clientsManager.getClient(createdClient.id);
    clientsManager.checkModel(client, expectedCreatedClient);

    const clients = await clientsManager.getClients();

    /**
     * const filteredClients = clients.filter(c => c.id === client.id);
     * expect(filteredClients.length).toBe(1);
     */

    expect(clients).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: client.id })]),
    );
  });
  it('/clients update full client entity (PATCH)', async () => {
    const createClientDto: CreateClientDTO = Client.createEntity({
      firstName: 'firstName',
      lastName: 'lastName',
    });
    const updateClientDto: Omit<UpdateClientDTO, 'id'> = {
      firstName: 'Marcus',
      lastName: 'Aurelius',
      address: 'Rome',
    };

    // const expectUpdatedClient = {
    //   firstName: updateClientDto.firstName,
    //   lastName: updateClientDto.lastName,
    //   address: updateClientDto.address,
    //   id: expect.any(String),
    // };

    const createdClient = await clientsManager.createClient(createClientDto);
    await clientsManager.updateClientAndCheck(
      createdClient.id,
      updateClientDto,
    );
  });

  it.skip('/clients update address of client (PATCH)', async () => {
    const dto: Omit<UpdateClientDTO, 'id'> = {
      firstName: 'Marcus',
      lastName: 'Aurelius',
      address: 'Rome',
    };

    const expectUpdatedClient = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      address: dto.address,
      id: expect.any(String),
    };
    let id: string;

    await request(httpServer)
      .put(navigateClients)
      .send(dto)
      .expect(HttpStatus.NO_CONTENT)
      .expect(({ body }: SuperTestBody<Client>) => {
        expect(body).toEqual(expectUpdatedClient);
        id = body.id;
      });

    await request(httpServer)
      .get(`${navigateClients}/:${id!}`)
      .expect(({ body }: SuperTestBody) => {
        expect(body).toEqual(expectUpdatedClient);
      });
  });

  it('/clients (DELETE)', async () => {
    const dto: CreateClientDTO = Client.createEntity({
      firstName: 'firstName',
      lastName: 'lastName',
    });

    const result = await clientsManager.createClient(dto);
    await clientsManager.deleteClient(result.id);
  });
});
