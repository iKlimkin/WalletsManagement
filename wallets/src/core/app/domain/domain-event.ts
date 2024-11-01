export type DomainEventMeta = {
  type: string;
  date: Date;
  userId: string | null;
  requestId: string;
};

export abstract class DomainEvent {
  private type: string;
  public meta: DomainEventMeta;

  constructor(type: string) {
    this.type = type;
  }

  public setMeta(meta: DomainEventMeta) {
    this.meta = {
      ...meta,
      type: this.type,
    };
  }
}
