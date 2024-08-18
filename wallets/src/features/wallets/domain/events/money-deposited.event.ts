export class MoneyDepositedEvent {
  constructor(
    public readonly walletId: string,
    public readonly amount: number,
  ) {}
}
