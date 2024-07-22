import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SuperTestBody } from '../shared/bodyTypes';
import { getAppForE2ETesting } from '../shared/tests.utils';
import { ClientManager } from '../shared/managers/ClientManager';
import { ClientsAdminRouting } from '../../src/infrastructure/routing/clients.route';
import { SecurityGovApiAdapter } from '../../src/features/clients/infrastructure/security-gov-api.adapter';
import { NotificationResponse } from '../../src/core/validation/notification';
import { ClientViewModel } from '../../src/features/clients/infrastructure/clients.query.repository';
import {
  CreateClientDTO,
  Client,
  UpdateClientDTO,
  validationConstants,
} from '../../src/features/clients/domain/entities/client.entity';

export enum NavigateEnum {
  clients = '/clients',
}

describe('ClientsController.admin.web (e2e)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let clientsAdminRouting: ClientsAdminRouting;
  const navigateClients = NavigateEnum.clients;
  let clientsManager: ClientManager;
  let securityMock: SecurityGovApiAdapter;
  const lastScammerName = 'Smith';
  securityMock = {
    isScammer: async (firstName, lastName) => lastName === 'Smith',
  };

  beforeAll(async () => {
    let settings = await getAppForE2ETesting((module) => {
      module.overrideProvider(SecurityGovApiAdapter).useValue(securityMock);
    });

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
    const dto: CreateClientDTO = await Client.createEntity({
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

    const client = await clientsManager.getClient(createdClient.data!.item.id);
    clientsManager.checkModel(client, expectedCreatedClient);

    const clients = await clientsManager.getClients();

    expect(clients).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: client.id })]),
    );
  });
  it('/clients (POST) - try create client with incorrect fields', async () => {
    const dto: CreateClientDTO = await Client.createEntity({
      firstName: '',
      lastName: 'lastName',
    });

    const result = await clientsManager.createClient(
      dto,
      HttpStatus.BAD_REQUEST,
    );
    expect(result.extensions.length).toBe(1);
    expect(result.extensions[0].key).toBe('firstName');
  });
  it('/clients update full client entity (PATCH)', async () => {
    const createClientDto: CreateClientDTO = await Client.createEntity({
      firstName: 'firstName',
      lastName: 'lastName',
    });
    const updateClientDto: Omit<UpdateClientDTO, 'id'> = {
      firstName: 'Marcus',
      lastName: 'Aurelius',
      address: '-'.repeat(validationConstants.address.minLength + 1),
    };

    const badUpdateClientDto: Omit<UpdateClientDTO, 'id'> = {
      firstName: 'Marcus',
      lastName: 'Aurelius',
      address: '-'.repeat(validationConstants.address.minLength - 1),
    };

    const badUpdateClientDto2: Omit<UpdateClientDTO, 'id'> = {
      firstName: 'Marcus',
      lastName: 'Aurelius',
      address: '-'.repeat(validationConstants.address.maxLength + 1),
    };

    // const expectUpdatedClient = {
    //   firstName: updateClientDto.firstName,
    //   lastName: updateClientDto.lastName,
    //   address: updateClientDto.address,
    //   id: expect.any(String),
    // };

    const createdClient = await clientsManager.createClient(createClientDto);
    await clientsManager.updateClientAndCheck(
      createdClient.data!.item.id,
      updateClientDto,
    );

    await clientsManager.updateClientAndCheck(
      createdClient.data!.item.id,
      badUpdateClientDto,
      HttpStatus.BAD_REQUEST,
    );
    await clientsManager.updateClientAndCheck(
      createdClient.data!.item.id,
      badUpdateClientDto2,
      HttpStatus.BAD_REQUEST,
    );
  });

  it(`try to create scammer `, async () => {
    const createScammerDto: CreateClientDTO = await Client.createEntity({
      firstName: 'firstName',
      lastName: lastScammerName,
    });
    await clientsManager.createClient(createScammerDto, HttpStatus.BAD_REQUEST);
  });

  it('/clients (DELETE)', async () => {
    const dto: CreateClientDTO = await Client.createEntity({
      firstName: 'firstName',
      lastName: 'lastName',
    });

    const createdClient = await clientsManager.createClient(dto);
    await clientsManager.deleteClient(createdClient.data!.item.id);
  });
});
