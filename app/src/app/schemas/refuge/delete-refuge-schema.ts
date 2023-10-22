import { Refuge } from './refuge';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { match } from 'ts-pattern';

export enum DeleteRefugeFromIdErrors {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CLIENT_SEND_DATA_ERROR = 'CLIENT_SEND_DATA_ERROR',
  PROGRAMMER_SEND_DATA_ERROR = 'PROGRAMMER_SEND_DATA_ERROR',
  SERVER_INCORRECT_DATA_FORMAT_ERROR = 'SERVER_INCORRECT_DATA_FORMAT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export type DeleteRefugeResponse =
  | {
      status: 'correct';
      data: Refuge;
    }
  | {
      status: 'error';
      error: DeleteRefugeFromIdErrors;
    };

export namespace DeleteRefugeFromIdErrors {
  export function from(
    err: HttpErrorResponse,
  ): DeleteRefugeFromIdErrors | never {
    return match(err.status)
      .returnType<DeleteRefugeFromIdErrors>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(
        HttpStatusCode.Unauthorized,
        () => DeleteRefugeFromIdErrors.UNAUTHORIZED,
      )
      .with(HttpStatusCode.Forbidden, () => DeleteRefugeFromIdErrors.FORBIDDEN)
      .with(HttpStatusCode.NotFound, () => DeleteRefugeFromIdErrors.NOT_FOUND)
      .with(
        HttpStatusCode.UnprocessableEntity,
        () => DeleteRefugeFromIdErrors.PROGRAMMER_SEND_DATA_ERROR,
      )
      .otherwise(() => DeleteRefugeFromIdErrors.UNKNOWN_ERROR);
  }
}
