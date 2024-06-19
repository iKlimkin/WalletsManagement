import { randomUUID } from 'node:crypto';
import { BaseDomainEntity } from '../../../../core/baseEntity';
import { Wallet } from '../../../wallets/domain/entities/wallet.entity';
import { Column, Entity } from 'typeorm';
import { UpdateClientCommand } from '../../application/use-cases/update-client.use-case';
import { ApiProperty } from '@nestjs/swagger';
import { Length, validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

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

  wallets: Wallet[];

  passportScan: FileInfo;

  static async createEntity(clientDto: CreateClientDTO) {
    const client = new Client();

    client.id = randomUUID();
    client.firstName = clientDto.firstName;
    client.lastName = clientDto.lastName;
    client.status = ClientStatus.New;

    const validationErrors = await validate(client);

    if (validationErrors.length > 0)
      throw new BadRequestException(validationErrors);

    return client;
  }

  update(command: UpdateClientCommand) {
    if (command.dto.firstName) this.firstName = command.dto.firstName;
    if (command.dto.lastName) this.lastName = command.dto.lastName;
    if (typeof command.dto.address !== undefined)
      this.address = command.dto.address;
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
  @ApiProperty()
  @Length(
    validationConstants.firstName.minLength,
    validationConstants.firstName.maxLength,
  )
  firstName: string;
  @ApiProperty()
  @Length(
    validationConstants.lastName.minLength,
    validationConstants.lastName.maxLength,
  )
  lastName: string;
}

export class UpdateClientDTO {
  id: string;
  @ApiProperty()
  @Length(
    validationConstants.firstName.minLength,
    validationConstants.firstName.maxLength,
  )
  firstName?: string;
  @ApiProperty()
  @Length(
    validationConstants.lastName.minLength,
    validationConstants.lastName.maxLength,
  )
  lastName?: string;
  @ApiProperty()
  @Length(
    validationConstants.address.minLength,
    validationConstants.address.maxLength,
  )
  address?: string;
}
