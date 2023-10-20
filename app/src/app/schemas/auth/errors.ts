import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { match } from 'ts-pattern';

export type AuthenticationErrors = ServerErrors | AdminErrors;

export enum ServerErrors {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INCORRECT_DATA_FORMAT = 'INCORRECT_DATA_FORMAT',
}

export enum AdminErrors {
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}

export namespace AuthenticationErrors {
  export function fromHttp(
    err: HttpErrorResponse,
  ): AuthenticationErrors | never {
    return match(err.status)
      .returnType<AuthenticationErrors>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(HttpStatusCode.Unauthorized, () => AdminErrors.INCORRECT_PASSWORD)
      .with(HttpStatusCode.NotFound, () => AdminErrors.USER_NOT_FOUND)
      .with(
        HttpStatusCode.UnprocessableEntity,
        () => ServerErrors.INCORRECT_DATA_FORMAT,
      )
      .otherwise(() => ServerErrors.UNKNOWN_ERROR);
  }
}
