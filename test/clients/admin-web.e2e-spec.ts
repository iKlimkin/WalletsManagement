import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  Client,
  validationConstants,
} from '../../src/features/clients/domain/entities/client.entity';
import { SecurityGovApiAdapter } from '../../src/core/infrastructure/adapters/security-gov-api.adapter';
import { NavigateEnum } from '../../src/infrastructure/routing/base.prefix';
import { ClientsAdminRouting } from '../../src/infrastructure/routing/clients.route';
import { aDescribe } from '../shared/aDescribe';
import { ClientManager } from '../shared/managers/ClientManager';
import { e2eTestNamesEnum, skipSettings } from '../shared/skip-test.settings';
import { getAppForE2ETesting } from '../shared/tests.utils';
import { SmtpAdapter } from '../../src/core/infrastructure/adapters/smtp.adapter';
import { delay } from '../shared/delay';
import { UpdateClientDTO } from '../../src/features/clients/dto/update-client.dto';

aDescribe(skipSettings.for(e2eTestNamesEnum.CLIENT))(
  'ClientsController.admin.web (e2e)',
  () => {
    let app: INestApplication;
    let httpServer: HttpServer;
    let clientsAdminRouting: ClientsAdminRouting;
    const navigateClients = NavigateEnum.clients;
    let clientsManager: ClientManager;
    let securityMock: SecurityGovApiAdapter;
    let smtpAdapterMock: SmtpAdapter;
    const lastScammerName = 'Smith';
    securityMock = {
      isScammer: async (firstName, lastName) => lastName === 'Smith',
    };
    smtpAdapterMock = {
      sendMail: jest.fn(async (mailDto: any) => {}),
    };

    beforeAll(async () => {
      let settings = await getAppForE2ETesting((module) => {
        module
          .overrideProvider(SecurityGovApiAdapter)
          .useValue(securityMock)
          .overrideProvider(SmtpAdapter)
          .useValue(smtpAdapterMock);
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
      const notification = await Client.createEntity({
        firstName: 'firstName',
        lastName: 'lastName',
      });

      const expectedCreatedClient = {
        firstName: notification.data!.firstName,
        lastName: notification.data!.lastName,
        address: null,
        id: expect.any(String),
      };

      const createdClient = await clientsManager.createClient(
        notification.data as Client,
      );

      const client = await clientsManager.getClient(
        createdClient.data!.item.id,
      );
      clientsManager.checkModel(client, expectedCreatedClient);

      const clients = await clientsManager.getClients();

      expect(clients).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: client.id })]),
      );
    });
    it('/clients (POST) - try create client with incorrect fields', async () => {
      const notification = await Client.createEntity({
        firstName: '',
        lastName: 'lastName',
      });

      const result = await clientsManager.createClient(
        notification.data as Client,
        HttpStatus.BAD_REQUEST,
      );
      expect(result.extensions.length).toBe(1);
      expect(result.extensions[0].key).toBe('firstName');
    });
    it.only('/clients update full client entity (PATCH)', async () => {
      const notification = await Client.createEntity({
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

      const createdClient = await clientsManager.createClient(
        notification.data as Client,
      );
      await clientsManager.updateClientAndCheck(
        createdClient.data!.item.id,
        updateClientDto,
      );

      expect(smtpAdapterMock.sendMail).toHaveBeenCalledTimes(1);

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
      const notification = await Client.createEntity({
        firstName: 'firstName',
        lastName: lastScammerName,
      });
      const result = await clientsManager.createClient(
        notification.data as Client,
        HttpStatus.BAD_REQUEST,
      );

      expect(result.extensions.length).toBe(1);
      expect(result.extensions[0].key).toBe('lastName');
      expect(result.code).toBe(2);
    });

    it('/clients (DELETE)', async () => {
      const notification = await Client.createEntity({
        firstName: 'firstName',
        lastName: 'lastName',
      });

      const createdClient = await clientsManager.createClient(
        notification.data as Client,
      );
      await clientsManager.deleteClient(createdClient.data!.item.id);
    });
  },
);
