import { NotificationResponse } from "./notification";

describe('NotificationResponse', () => {
  let notificationResponse: NotificationResponse;

  beforeEach(() => {
    notificationResponse = new NotificationResponse();
  });

  test('should initialize with no errors', () => {
    expect(notificationResponse.code).toBe(0);
    expect(notificationResponse.extensions).toHaveLength(0);
  });

  test('should return false for hasError when no errors', () => {
    expect(notificationResponse.hasError()).toBe(false);
  });

  test('should add an error with a default code', () => {
    const message = 'Error message';
    notificationResponse.addError(message);

    expect(notificationResponse.code).toBe(1);
    expect(notificationResponse.extensions).toHaveLength(1);
    expect(notificationResponse.extensions[0].message).toBe(message);
    expect(notificationResponse.extensions[0].key).toBeUndefined();
  });

  test('should add an error with a custom code', () => {
    const message = 'Error message';
    const customCode = 123;
    notificationResponse.addError(message, undefined, customCode);

    expect(notificationResponse.code).toBe(customCode);
    expect(notificationResponse.extensions).toHaveLength(1);
    expect(notificationResponse.extensions[0].message).toBe(message);
    expect(notificationResponse.extensions[0].key).toBeUndefined();
  });

  test('should add an error with a key', () => {
    const message = 'Error message';
    const key = 'ERROR_KEY';
    notificationResponse.addError(message, key);

    expect(notificationResponse.code).toBe(1);
    expect(notificationResponse.extensions).toHaveLength(1);
    expect(notificationResponse.extensions[0].message).toBe(message);
    expect(notificationResponse.extensions[0].key).toBe(key);
  });

  test('should return true for hasError when an error is added', () => {
    notificationResponse.addError('Error message');

    expect(notificationResponse.hasError()).toBe(true);
  });
});
