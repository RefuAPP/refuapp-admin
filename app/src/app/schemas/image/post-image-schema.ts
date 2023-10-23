import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { match } from 'ts-pattern';

export enum PostImageErrors {
  INVALID_REQUEST = 'INVALID_REQUEST',
  PROGRAMMER_SEND_DATA_ERROR = 'PROGRAMMER_SEND_DATA_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SERVER_INCORRECT_DATA_FORMAT_ERROR = 'SERVER_INCORRECT_DATA_FORMAT_ERROR',
}

export type PostImageResponse =
  | {
      status: 'correct';
      data: string;
    }
  | {
      status: 'error';
      error: PostImageErrors;
    };

export namespace PostImageErrors {
  export function from(err: HttpErrorResponse): PostImageErrors | never {
    return match(err.status)
      .returnType<PostImageErrors>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(HttpStatusCode.BadRequest, () => PostImageErrors.INVALID_REQUEST)
      .with(
        HttpStatusCode.UnprocessableEntity,
        () => PostImageErrors.PROGRAMMER_SEND_DATA_ERROR,
      )
      .otherwise(() => PostImageErrors.UNKNOWN_ERROR);
  }
}
