export class UpdatePassportCommand {
  constructor(
    public serial: string,
    public number: string,
    public issueDate: Date,
    public clientId: string,
  ) {}
}
