import { Refuge } from './refuge';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { match } from 'ts-pattern';

export enum GetAllRefugesErrors {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SERVER_INCORRECT_DATA_FORMAT_ERROR = 'SERVER_INCORRECT_DATA_FORMAT_ERROR',
}

export type GetAllRefugesResponse =
  | {
      status: 'correct';
      data: Refuge[];
    }
  | {
      status: 'error';
      error: GetAllRefugesErrors;
    };

export namespace GetAllRefugesErrors {
  export function from(err: HttpErrorResponse): GetAllRefugesErrors | never {
    return match(err.status)
      .returnType<GetAllRefugesErrors>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .otherwise(() => GetAllRefugesErrors.UNKNOWN_ERROR);
  }
}
