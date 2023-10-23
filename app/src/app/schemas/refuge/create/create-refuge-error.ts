import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { isMatching, match, P } from 'ts-pattern';

export type CreateRefugeError = ServerError | ClientError;

export enum ServerError {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INCORRECT_DATA = 'INCORRECT_DATA',
}

export type ClientError = {
  type: 'INVALID_USER_DATA';
  message: string;
};

export namespace CreateRefugeError {
  export function fromHttp(err: HttpErrorResponse): CreateRefugeError | never {
    return match(err.status)
      .returnType<CreateRefugeError>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
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
): CreateRefugeError {
  const errorResponse: UnprocessableEntityRefuge = err.error;
  if (isMatching(UnprocessableEntityRefugePattern, errorResponse))
    return { type: 'INVALID_USER_DATA', message: errorResponse.detail[0].msg };
  return ServerError.INCORRECT_DATA;
}
