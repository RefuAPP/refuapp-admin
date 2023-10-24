import {Refuge} from './refuge';
import {HttpErrorResponse} from '@angular/common/http';
import {match, P} from 'ts-pattern';

export enum GetAllRefugesErrors {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SERVER_INCORRECT_DATA_FORMAT_ERROR = 'SERVER_INCORRECT_DATA_FORMAT_ERROR',
}

export type CorrectGetRefuges = {
  status: 'correct';
  data: Refuge[];
}

export type ErrorGetRefuges = {
  status: 'error';
  error: GetAllRefugesErrors;
};

export type GetAllRefugesResponse =
  | CorrectGetRefuges
  | ErrorGetRefuges;

export const CorrectGetRefugesPattern: P.Pattern<CorrectGetRefuges> = {};
export const ErrorGetRefugesPattern: P.Pattern<ErrorGetRefuges> = {};

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
