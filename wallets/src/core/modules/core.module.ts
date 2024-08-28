import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxRepository } from '../db/outbox.repository';
import { OutboxEvent } from '../entities/outbox-event.entity';
import { SmtpAdapter } from '../infrastructure/adapters/smtp.adapter';
import { StoreService } from '../infrastructure/adapters/store.service';
import { BaseUseCaseServicesWrapper } from '../infrastructure/base-use-cases-services.wrapper';
import { CqrsModule } from '@nestjs/cqrs';
import { AlsModule } from '../../als-module/als.module';
import { ScheduleModule } from '@nestjs/schedule';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([OutboxEvent]),
    CqrsModule,
    AlsModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    SmtpAdapter,
    OutboxRepository,
    BaseUseCaseServicesWrapper,
    StoreService,
  ],
  exports: [
    SmtpAdapter,
    BaseUseCaseServicesWrapper,
    StoreService,
    // OutboxRepository,
  ],
})
export class CoreModule {}
