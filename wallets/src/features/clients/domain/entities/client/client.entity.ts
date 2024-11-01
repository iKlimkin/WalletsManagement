import { randomUUID } from 'node:crypto';
import { AfterLoad, Column, Entity, OneToMany } from 'typeorm';
import { BaseDomainEntity } from '../../../../../core/entities/baseEntity';
import { DomainNotificationResponse } from '../../../../../core/validation/notification';
import { validateEntity } from '../../../../../core/validation/validation-utils';
import { Wallet } from '../../../../wallets/domain/entities/wallet.entity';
import { UpdateClientCommand } from '../../../application/use-cases/update-client.use-case';
import { CreateClientDTO } from '../../../dto/create-client.dto';
import { IClientStatusState } from './status-states/IClientStatusState';
import { ClientCreatedEvent } from './events/client-created.event';
import { ClientDeletedEvent } from './events/client-deleted.event';
import { ClientUpdatedEvent } from './events/client-updated.event';
import { ClientActiveState } from './status-states/ClientActiveState';
import { ClientBlockedState } from './status-states/ClientBlockedState';
import { ClientDeletedState } from './status-states/ClientDeletedState';
import { ClientNewState } from './status-states/ClientNewState';
import { ClientOnVerificationState } from './status-states/ClientOnVerificationState';
import { ClientRejectedState } from './status-states/ClientRejectedState';
import { UpdatePassportCommand } from '../../../dto/update-passport.command';

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
export class Client extends BaseDomainEntity {
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
  public passportData: PassportInfo;

  private clientStatusState: IClientStatusState;

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
    const { firstName, lastName, address } = command.dto;
    if (firstName) this.firstName = firstName;
    if (lastName) this.lastName = lastName;
    if (typeof address !== 'undefined') this.address = command.dto.address;

    const clientUpdatedEvent = new ClientUpdatedEvent(this.id, command.dto);

    return validateEntity(this, clientUpdatedEvent);
  }

  async delete(wallets: Wallet[]) {
    this.clientStatusState.delete(wallets);
    return new DomainNotificationResponse<Client>(this);
  }

  @AfterLoad()
  initStatusState(): void {
    const stateMap = new Map<ClientStatus, IClientStatusState>([
      [ClientStatus.New, new ClientNewState(this)],
      [ClientStatus.OnVerification, new ClientOnVerificationState(this)],
      [ClientStatus.Active, new ClientActiveState(this)],
      [ClientStatus.Rejected, new ClientRejectedState(this)],
      [ClientStatus.Blocked, new ClientBlockedState(this)],
      [ClientStatus.Deleted, new ClientDeletedState(this)],
    ]);

    const clientState = stateMap.get(this.status);

    if (!clientState) {
      throw new Error(
        'ClientStatusState is not registered for this status: ' + this.status,
      );
    }

    this.clientStatusState = clientState;
  }

  activate() {
    if (this.status !== ClientStatus.OnVerification) {
      throw new Error(`can't be activate`);
    }
    this.status = ClientStatus.Active;
  }

  reject() {
    if (this.status !== ClientStatus.OnVerification) {
      throw new Error(`can't be rejected`);
    }
    this.status = ClientStatus.Rejected;
  }

  updatePassport(command: UpdatePassportCommand) {
    this.clientStatusState.updatePassport(command);
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

class PassportInfo extends BaseDomainEntity {
  public serial: string;
  public number: string;
  public issueDate: Date;
}

/**
 * Add interceptor commit
 */