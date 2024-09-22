import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlsModule } from '../../als-module/als.module';
import { SecurityGovApiAdapter } from '../../core/infrastructure/adapters/security-gov-api.adapter';
import { ClientsController } from './api/admin-web/clients.controller';
import { ClientCrudApiService } from './api/services/clients-curd-api.service';
import { ClientsService } from './application/clients.service';
import { ClientUpdatedEventHandler } from './application/events-handlers/send-email-to-manager-after-updated-client';
import { CreateClientUseCase } from './application/use-cases/create-client.use-case';
import { DeleteClientUseCase } from './application/use-cases/delete-client.use-case';
import { UpdateClientUseCase } from './application/use-cases/update-client.use-case';
import { Client } from './domain/entities/client/client.entity';
import { ClientsQueryRepository } from './infrastructure/clients.query.repository';
import { ClientsRepository } from './infrastructure/clients.repository';
import { WalletsModule } from '../wallets/wallets.module';
import { CoreModule } from '../../core/modules/core.module';
import { UpdateClientPassportUseCase } from './application/use-cases/update-passport-data-client.use-case';
import { RejectClientUseCase } from './application/use-cases/reject-client.use-case';

const eventHandlers = [ClientUpdatedEventHandler];
const useCases = [
  CreateClientUseCase,
  UpdateClientUseCase,
  DeleteClientUseCase,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    CqrsModule,
    AlsModule,
    WalletsModule,
  ],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    ClientsQueryRepository,
    ClientsRepository,
    SecurityGovApiAdapter,
    ClientCrudApiService,
    UpdateClientPassportUseCase,
    RejectClientUseCase,
    ...eventHandlers,
    ...useCases,
  ],
})
export class ClientsModule {
  static forRoot(providers: any[]): DynamicModule {
    return {
      module: ClientsModule,
      providers,
    };
  }
}
