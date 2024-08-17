import { CurrencyType } from "../entities/wallet.entity";

export class WalletCreatedEvent {
  constructor(
    public readonly walletId: string,
    public readonly title: string,
    public readonly currency: CurrencyType,
    public readonly balance: number,
    public readonly clientId: string,
  ) {}
}
