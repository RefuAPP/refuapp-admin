import { Refuge, RefugePattern } from '../refuge';
import { isMatching } from 'ts-pattern';
import { CreateRefugeError, ServerError } from './create-refuge-error';
import { HttpErrorResponse } from '@angular/common/http';

export type CreateRefugeResponse =
  | {
      status: 'created';
      data: Refuge;
    }
  | {
      status: 'error';
      error: CreateRefugeError;
    };

export function fromResponse(response: any): CreateRefugeResponse {
  if (isMatching(RefugePattern, response))
    return { status: 'created', data: response };
  return {
    status: 'error',
    error: ServerError.INCORRECT_DATA,
  };
}

export function fromError(err: HttpErrorResponse): CreateRefugeResponse {
  return {
    status: 'error',
    error: CreateRefugeError.fromHttp(err),
  };
}
