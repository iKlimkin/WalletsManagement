import { Injectable } from '@nestjs/common';

@Injectable()
export class SmtpAdapter {
  async sendMail(mailDto: SendMailParams): Promise<void> {
    console.log('email sent');
  }
}

type SendMailParams = {
  to: string;
  subject: string;
  text: string;
};
