import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Photo } from '@capacitor/camera';
import { environment } from '../../../environments/environment';
import { catchError, map, ObservableInput, of, retry } from 'rxjs';
import {
  PostImageErrors,
  PostImageResponse,
} from '../../schemas/image/post-image-schema';
import { isMatching, P } from 'ts-pattern';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}

  uploadImage(photo: Photo) {
    const data = this.getFormDataFrom(photo);
    return this.uploadImageToApi(data);
  }

  private uploadImageToApi(data: FormData) {
    const endpoint = this.uploadImageEndpoint();
    return this.http.post<string>(endpoint, data).pipe(
      map<string, PostImageResponse | Error>((filePath: string) => {
        if (isMatching(P.string, filePath))
          return { status: 'correct', data: filePath };
        console.error('Server returned incorrect data format');
        return {
          status: 'error',
          error: PostImageErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR,
        };
      }),
      catchError<PostImageResponse | Error, ObservableInput<any>>(
        (err: HttpErrorResponse) =>
          of({
            status: 'error',
            error: PostImageErrors.from(err),
          }),
      ),
      retry(3),
    );
  }

  private uploadImageEndpoint(): string {
    return `${environment.API}/images/`;
  }

  private getFormDataFrom(photo: Photo): FormData {
    const formData = new FormData();
    const blob = this.b64toBlob(photo.base64String, `image/${photo.format}`);
    formData.append('image', blob);
    return formData;
  }

  private b64toBlob(
    b64Data: string | undefined,
    contentType: string,
    sliceSize: number = 512,
  ): Blob {
    if (b64Data === undefined) {
      throw new Error('b64Data is undefined');
    }
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }
}
