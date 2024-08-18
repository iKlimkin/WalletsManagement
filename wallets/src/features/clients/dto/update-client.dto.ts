import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';
import { validationConstants } from '../domain/entities/client.entity';

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
