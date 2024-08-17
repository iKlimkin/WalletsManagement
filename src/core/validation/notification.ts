import { IEvent } from '@nestjs/cqrs';

export class NotificationResponse<T = null> {
  constructor(data: T | null = null) {
    this.data = data;
  }
  extensions: NotificationExtension[] = [];
  code = 0;
  data: T | null = null;

  get hasError() {
    return this.code !== 0;
  }

  addData(data: T) {
    this.data = data;
  }

  addError(message: string, key?: string, code?: number) {
    this.code = code ?? 1;
    this.extensions.push(new NotificationExtension(message, key));
  }
}

class NotificationExtension {
  constructor(
    public message: string,
    public key?: string,
  ) {}
}

export class DomainNotificationResponse<
  TData = null,
> extends NotificationResponse<TData> {
  public events: IEvent[] = [];
  addEvents(events: IEvent[]) {
    this.events = [...this.events, ...events];
  }

  static create<T>(
    mainNotice: DomainNotificationResponse<T>,
    ...otherNotifications: DomainNotificationResponse[]
  ) {
    const domainNotice = new DomainNotificationResponse<T>();
    domainNotice.addData(mainNotice.data);
    domainNotice.events = mainNotice.events;
    domainNotice.extensions.forEach((ext) =>
      domainNotice.addError(ext.message, ext.key),
    );
    otherNotifications.forEach((notice) => {
      domainNotice.addData(notice.data);
      domainNotice.events = [...domainNotice.events, ...notice.events];
      notice.extensions.forEach((ext) =>
        domainNotice.addError(ext.message, ext.key),
      );
    });

    return domainNotice;
  }
}
