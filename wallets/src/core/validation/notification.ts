import { IEvent } from '@nestjs/cqrs';

export class NotificationResponse<T = null> {
  constructor(data: T | null = null) {
    this.data = data;
  }
  extensions: NotificationExtension[] = [];
  code = 0;
  data: T | null = null;

  static createError(
    message: string,
    key: string | null = null,
    code: number | null = null,
  ) {
    const notification = new NotificationResponse();
    notification.addError(message, key, code);
    return notification;
  }

  addSuccess(message: string, key: string | null = null) {
    this.extensions.push(new NotificationExtension(message, key, 0));
  }

  get hasError() {
    return this.code !== 0;
  }

  addData(data: T) {
    this.data = data;
  }

  addExtension(message: string, key: string | null = null, code: number) {
    this.extensions.push(new NotificationExtension(message, key, code));
  }

  setCode(code: number) {
    this.code = code;
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
    public code = 1,
  ) {}
}

export class DomainNotificationResponse<
  TData = null,
> extends NotificationResponse<TData> {
  public events: IEvent[] = [];
  addEvents(...events: IEvent[]) {
    this.events = [...this.events, ...events];
  }

  static createError(
    message: string,
    key: string | null = null,
    code: number | null = null,
  ) {
    const notification = new DomainNotificationResponse();
    notification.addError(message, key, code);
    return notification;
  }

  static merge<T>(
    mainNotice: DomainNotificationResponse<T>,
    ...otherNotifications: DomainNotificationResponse[]
  ) {
    const domainNotice = new DomainNotificationResponse<T>();

    domainNotice.setCode(mainNotice.code);

    if (!!mainNotice.data) {
      domainNotice.addData(mainNotice.data);
    }
    domainNotice.events = mainNotice.events;

    mainNotice.extensions.forEach(({ message, key, code }) =>
      domainNotice.addError(message, key, code),
    );
    otherNotifications.forEach((notice) => {
      domainNotice.events = [...domainNotice.events, ...notice.events];
      notice.extensions.forEach(({ message, key, code }) =>
        domainNotice.addError(message, key, code),
      );
    });

    return domainNotice;
  }
}
