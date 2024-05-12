import { randomUUID } from 'node:crypto';
import { BaseDomainEntity } from '../../../../core/baseEntity';
import { Wallet } from '../../../wallets/domain/entities/wallet.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Client extends BaseDomainEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  status: ClientStatus;

  @Column({ nullable: true })
  totalBalance: string;

  wallets: Wallet[];

  passportScan: FileInfo;

  static createEntity(clientDto: CreateClientDTO) {
    const client = new Client();

    client.id = randomUUID();
    client.firstName = clientDto.firstName;
    client.lastName = clientDto.lastName;
    client.status = ClientStatus.New;

    return client;
  }
}

enum ClientStatus {
  New,
  Active,
  Blocked,
  Rejected,
  OnVerification,
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

export class CreateClientDTO {
  firstName: string;
  lastName: string;
}
