import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { isMatching, match, P } from 'ts-pattern';

export type UpdateRefugeError = ServerError | ClientError;

export enum ServerError {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INCORRECT_DATA = 'INCORRECT_DATA',
}

export type ClientError = {
  type: 'INVALID_USER_DATA';
  message: string;
};

export namespace UpdateRefugeError {
  export function fromHttp(err: HttpErrorResponse): UpdateRefugeError | never {
    return match(err.status)
      .returnType<UpdateRefugeError>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(HttpStatusCode.Unauthorized, () => ServerError.UNAUTHORIZED)
      .with(HttpStatusCode.Forbidden, () => ServerError.FORBIDDEN)
      .with(HttpStatusCode.NotFound, () => ServerError.NOT_FOUND)
      .with(HttpStatusCode.Conflict, () => ServerError.CONFLICT)
      .with(HttpStatusCode.UnprocessableEntity, () =>
        getErrorFromUnprocessableEntity(err),
      )
      .otherwise(() => ServerError.UNKNOWN_ERROR);
  }
}

type UnprocessableEntityRefugeDetail = {
  loc: [string, number];
  msg: string;
  type: string;
};

type UnprocessableEntityRefuge = {
  detail: UnprocessableEntityRefugeDetail[];
};

const UnprocessableEntityRefugePattern: P.Pattern<UnprocessableEntityRefuge> =
  {};

function getErrorFromUnprocessableEntity(
  err: HttpErrorResponse,
): UpdateRefugeError {
  const errorResponse: UnprocessableEntityRefuge = err.error;
  if (isMatching(UnprocessableEntityRefugePattern, errorResponse))
    return { type: 'INVALID_USER_DATA', message: errorResponse.detail[0].msg };
  return ServerError.INCORRECT_DATA;
}
