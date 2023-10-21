import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Refuge } from 'src/app/schemas/refuge/refuge';
import { match } from 'ts-pattern';

export enum GetRefugeFromIdErrors {
  NOT_FOUND = 'NOT_FOUND',
  CLIENT_SEND_DATA_ERROR = 'CLIENT_SEND_DATA_ERROR',
  PROGRAMMER_SEND_DATA_ERROR = 'PROGRAMMER_SEND_DATA_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SERVER_INCORRECT_DATA_FORMAT_ERROR = 'SERVER_INCORRECT_DATA_FORMAT_ERROR',
}

export type GetRefugeResponse =
  | {
      status: 'correct';
      data: Refuge;
    }
  | {
      status: 'error';
      error: GetRefugeFromIdErrors;
    };

export namespace GetRefugeFromIdErrors {
  export function from(err: HttpErrorResponse): GetRefugeFromIdErrors | never {
    return match(err.status)
      .returnType<GetRefugeFromIdErrors>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(HttpStatusCode.NotFound, () => GetRefugeFromIdErrors.NOT_FOUND)
      .with(
        HttpStatusCode.UnprocessableEntity,
        () => GetRefugeFromIdErrors.PROGRAMMER_SEND_DATA_ERROR,
      )
      .otherwise(() => GetRefugeFromIdErrors.UNKNOWN_ERROR);
  }
}
