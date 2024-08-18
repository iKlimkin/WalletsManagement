import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityGovApiAdapter {
  async isScammer(firstName: string, lastName: string): Promise<boolean> {
    let scammer = false;
    if (lastName === 'Smith') scammer = true;
    return scammer;
  }
}
