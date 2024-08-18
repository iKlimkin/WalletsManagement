import { HttpServer, INestApplication } from '@nestjs/common';
import { ClientsAdminRouting } from '../../src/infrastructure/routing/clients.route';
import { WalletsRouting } from '../../src/infrastructure/routing/wallets.route';
import { ClientManager } from '../shared/managers/ClientManager';
import { WalletManager } from '../shared/managers/WalletManager';
import { getAppForE2ETesting, truncateDBTables } from '../shared/tests.utils';
import { Client } from '../../src/features/clients/domain/entities/client.entity';
import { aDescribe } from '../shared/aDescribe';
import { e2eTestNamesEnum, skipSettings } from '../shared/skip-test.settings';

aDescribe(skipSettings.for(e2eTestNamesEnum.WALLET))(
  'WalletsController.admin.web (e2e)',
  () => {
    let app: INestApplication;
    let httpServer: HttpServer;
    let walletsAdminRouting: WalletsRouting;
    let walletsManager: WalletManager;
    let clientsManager: ClientManager;
    let clientsAdminRouting: ClientsAdminRouting;

    beforeAll(async () => {
      let settings = await getAppForE2ETesting();

      app = settings.app;
      httpServer = settings.httpServer;
      walletsAdminRouting = new WalletsRouting();
      clientsAdminRouting = new ClientsAdminRouting();

      walletsManager = new WalletManager(app, walletsAdminRouting);
      clientsManager = new ClientManager(app, clientsAdminRouting);
    });

    afterAll(async () => {
      await app.close();
    });

    it('create wallet', async () => {
      const clientNotice = await Client.createEntity({
        firstName: 'FirstClientName',
        lastName: 'FirstClientSurname',
      });
      const clientNoticeSecond = await Client.createEntity({
        firstName: 'SecondClientName',
        lastName: 'SecondClientSurname',
      });

      const { data: firstClient } = await clientsManager.createClient(
        clientNotice.data as Client,
      );

      const { data: secondClient } = await clientsManager.createClient(
        clientNoticeSecond.data as Client,
      );

      const { data: firstWalletData } = await walletsManager.createWallet({
        clientId: firstClient!.item.id,
      });
      const { data: secondWalletData } = await walletsManager.createWallet({
        clientId: secondClient!.item.id,
      });

      await walletsManager.makeMoneyTransfer({
        fromWalletId: firstWalletData!.item.id,
        toWalletId: secondWalletData!.item.id,
        amount: 50,
      });

      const firstWalletAfterTransfer = await walletsManager.getWallet(
        firstWalletData!.item.id,
      );
      const secondWalletAfterTransfer = await walletsManager.getWallet(
        secondWalletData!.item.id,
      );
      expect(firstWalletAfterTransfer.balance).toEqual(50);
      expect(secondWalletAfterTransfer.balance).toEqual(150);
    });

    it('', async () => {});
  },
);
