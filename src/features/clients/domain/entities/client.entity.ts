import { randomUUID } from 'node:crypto';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseDomainAggregateEntity } from '../../../../core/base-domain-aggregate.entity';
import { BaseDomainEntity } from '../../../../core/baseEntity';
import {
  DomainNotificationResponse,
  NotificationResponse,
} from '../../../../core/validation/notification';
import { validateEntity } from '../../../../core/validation/validation-utils';
import { Wallet } from '../../../wallets/domain/entities/wallet.entity';
import { UpdateClientCommand } from '../../application/use-cases/update-client.use-case';
import { CreateClientDTO } from '../../dto/create-client.dto';
import { ClientUpdatedEvent } from '../events/client-updated.event';
import { ClientCreatedEvent } from '../events/client-created.event';
import { ClientDeletedEvent } from '../events/client-deleted.event';

export const validationConstants = {
  firstName: {
    minLength: 2,
    maxLength: 30,
  },
  lastName: {
    minLength: 2,
    maxLength: 30,
  },
  address: {
    minLength: 10,
    maxLength: 30,
  },
};

@Entity()
export class Client extends BaseDomainAggregateEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  status: ClientStatus;

  @Column({ nullable: true })
  totalBalance: string;

  @OneToMany(() => Wallet, (wallet) => wallet.client)
  wallets: Wallet[];

  // @Column()
  passportScan: FileInfo;

  static async createEntity(
    clientDto: CreateClientDTO,
  ): Promise<DomainNotificationResponse<Client>> {
    const client = new Client();

    client.id = randomUUID();
    client.firstName = clientDto.firstName;
    client.lastName = clientDto.lastName;
    client.status = ClientStatus.OnVerification;

    const clientCreatedEvent = new ClientCreatedEvent(
      client.id,
      client.firstName,
      client.lastName,
      client.status,
    );

    return validateEntity(client, clientCreatedEvent);
  }

  async update(
    command: UpdateClientCommand,
  ): Promise<DomainNotificationResponse<Client>> {
    if (command.dto.firstName) this.firstName = command.dto.firstName;
    if (command.dto.lastName) this.lastName = command.dto.lastName;
    if (typeof command.dto.address !== undefined)
      this.address = command.dto.address;

    const clientUpdatedEvent = new ClientUpdatedEvent(this.id, command);
    // this.apply(clientUpdatedEvent);

    return validateEntity(this, clientUpdatedEvent);
  }

  async delete(wallets: Wallet[]) {
    let domainNotice = new DomainNotificationResponse<Client>();
    if (wallets.some((w) => w.balance > 0)) {
      domainNotice.addError('Client has active wallets', null, 1);
    } else {
      this.status = ClientStatus.Deleted;
      domainNotice.addEvents([new ClientDeletedEvent(this.id)]);
    }
    return domainNotice;
  }
}

export enum ClientStatus {
  New,
  Active,
  Blocked,
  Rejected,
  OnVerification,
  Deleted,
}

export class PassportScan extends BaseDomainEntity {
  fileInfo: FileInfo;
  status: PassportScanStatus;
}

enum PassportScanStatus {
  Pending,
  Verified,
  Rejected,
}

export class FileInfo extends BaseDomainEntity {
  url: string;
  title: string;
}
