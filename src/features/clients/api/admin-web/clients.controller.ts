import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientsService } from '../../application/clients.service';
import { CreateClientUseCase } from '../../application/use-cases/create-client.use-case';
import { ClientsQueryRepository } from '../../infrastructure/clients.query.repository';
import { CreateClientDTO } from '../../domain/entities/client.entity';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly clientsQueryRepository: ClientsQueryRepository,
    private readonly createClientUseCase: CreateClientUseCase,
  ) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDTO) {
    const clientEntity = await this.createClientUseCase.execute(createClientDto);
    return this.clientsQueryRepository.getById(clientEntity.id)
  }

  @Get()
  findAll() {
    return this.clientsQueryRepository.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: any) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
