import { Refuge, RefugePattern } from '../refuge';
import { isMatching } from 'ts-pattern';
import { ServerError, UpdateRefugeError } from './update-refuge-error';
import { HttpErrorResponse } from '@angular/common/http';

export type UpdateRefugeResponse =
  | {
      status: 'updated';
      data: Refuge;
    }
  | {
      status: 'error';
      error: UpdateRefugeError;
    };

export function updateRefugeResponseFromResponse(
  response: any,
): UpdateRefugeResponse {
  if (isMatching(RefugePattern, response))
    return { status: 'updated', data: response };
  return {
    status: 'error',
    error: ServerError.INCORRECT_DATA,
  };
}

export function updateRefugeResponseFromError(
  err: HttpErrorResponse,
): UpdateRefugeResponse {
  return {
    status: 'error',
    error: UpdateRefugeError.fromHttp(err),
  };
}
