import { ValidationError, validateOrReject } from 'class-validator';
import { ValidationPipeErrorType } from '../../config/pipesSetup';
import { DomainNotificationResponse } from './notification';

export class DomainError extends Error {
  constructor(
    message: string,
    public notificationResponse: DomainNotificationResponse,
  ) {
    super(message);
  }
}

export const validateEntityOrThrowAsync = async (entity: any) => {
  try {
    await validateOrReject(entity);
  } catch (error) {
    const responseNotification: DomainNotificationResponse =
      mapErrorsToNotification(
        validationErrorsMapper.mapValidationErrorToValidationPipeErrorTArray(
          error,
        ),
      );
    throw new DomainError(
      'domain entity validation error',
      responseNotification,
    );
  }
};
export const validateEntity = async <T extends Object>(
  entity: T,
  ...events: any[]
): Promise<DomainNotificationResponse<T>> => {
  try {
    await validateOrReject(entity);
  } catch (error) {
    const responseNotification: DomainNotificationResponse<T> =
      mapErrorsToNotification(
        validationErrorsMapper.mapValidationErrorToValidationPipeErrorTArray(
          error,

        ),
      );

    responseNotification.addEvents(events);
    return responseNotification;
  }
  let domainNotificationResponse = new DomainNotificationResponse<T>(entity);
  domainNotificationResponse.addEvents(events);
  return domainNotificationResponse;
};

export const mapErrorsToNotification = (errors: ValidationPipeErrorType[]) => {
  const resultNotification = new DomainNotificationResponse();
  errors.forEach((error) => {
    resultNotification.addError(error.message, error.field, 1);
  });
  return resultNotification;
};

export const validationErrorsMapper = {
  mapValidationErrorToValidationPipeErrorTArray: (errors: ValidationError[]) =>
    errors.flatMap((error) =>
      Object.entries(error.constraints).map(([_, value]) => ({
        field: error.property,
        message: value,
      })),
    ),
};
