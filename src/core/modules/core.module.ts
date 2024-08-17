import { Global, Module } from '@nestjs/common';
import { SmtpAdapter } from '../infrastructure/adapters/smtp.adapter';

@Global()
@Module({
  providers: [SmtpAdapter],
  exports: [SmtpAdapter],
})
export class CoreModule {}
