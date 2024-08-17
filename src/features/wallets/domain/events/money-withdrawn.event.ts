export class MoneyWithdrawEvent {
  constructor(
    public readonly walletId: string,
    public readonly amount: number,
  ) {}
}
