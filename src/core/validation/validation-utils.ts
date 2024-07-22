import { ValidationError, validateOrReject } from 'class-validator';
import { ValidationPipeErrorType } from '../../config/pipesSetup';
import { NotificationResponse } from './notification';

export class DomainError extends Error {
  constructor(
    message: string,
    public notificationResponse: NotificationResponse,
  ) {
    super(message);
  }
}

export const checkEntityValidation = async (entity: any) => {
  try {
    await validateOrReject(entity);
  } catch (error) {
    const responseNotification: NotificationResponse = mapErrorsToNotification(
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

export const mapErrorsToNotification = (errors: ValidationPipeErrorType[]) => {
  const resultNotification = new NotificationResponse();
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
