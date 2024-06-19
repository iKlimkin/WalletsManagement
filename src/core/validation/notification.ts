export class NotificationResponse<T = null> {
  extensions: NotificationExtension[] = [];
  code = 0;
  data: T | null = null;

  hasError() {
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
