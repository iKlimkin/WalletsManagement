import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Scope,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateClientCommand } from '../../application/use-cases/create-client.use-case';
import { DeleteClientCommand } from '../../application/use-cases/delete-client.use-case';
import { UpdateClientCommand } from '../../application/use-cases/update-client.use-case';
import { ClientsQueryRepository } from '../../infrastructure/clients.query.repository';
import { ClientCrudApiService } from '../services/clients-curd-api.service';
import { NavigateEnum } from '../../../../infrastructure/routing/base.prefix';
import { CreateClientDTO } from '../../dto/create-client.dto';
import { UpdateClientDTO } from '../../dto/update-client.dto';

@Controller({ path: NavigateEnum.clients, scope: Scope.REQUEST })
export class ClientsController {
  constructor(
    private readonly clientsQueryRepository: ClientsQueryRepository,
    private readonly commandBus: CommandBus,
    protected readonly clientCrudApiService: ClientCrudApiService,
  ) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDTO) {
    const command = new CreateClientCommand(createClientDto);
    return this.clientCrudApiService.create(command);
  }

  @Get()
  findAll() {
    return this.clientsQueryRepository.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const client = await this.clientsQueryRepository.getById(id);

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDTO,
  ) {
    const command = new UpdateClientCommand({ ...updateClientDto, id });
    await this.commandBus.execute(command);
  }

  @Put(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDTO,
  ) {
    const command = new UpdateClientCommand({ ...updateClientDto, id });
    await this.commandBus.execute(command);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const command = new DeleteClientCommand(id);
    await this.commandBus.execute(command);
  }
}
