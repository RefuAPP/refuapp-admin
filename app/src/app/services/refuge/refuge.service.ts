import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, ObservableInput, of, retry } from 'rxjs';
import {
  GetAllRefugesErrors,
  GetAllRefugesResponse,
} from '../../schemas/refuge/get-all-refuges-schema';
import { environment } from '../../../environments/environment';
import { isValidId, Refuge, RefugePattern } from '../../schemas/refuge/refuge';
import { isMatching } from 'ts-pattern';
import {
  GetRefugeFromIdErrors,
  GetRefugeResponse,
} from '../../schemas/refuge/get-refuge-schema';
import {
  DeleteRefugeFromIdErrors,
  DeleteRefugeResponse,
} from '../../schemas/refuge/delete-refuge-schema';

@Injectable({
  providedIn: 'root',
})
export class RefugeService {
  constructor(private http: HttpClient) {}

  getRefuges(): Observable<GetAllRefugesResponse> {
    return this.getAllRefugesFromApi();
  }

  private getAllRefugesFromApi(): Observable<GetAllRefugesResponse> {
    const endpoint = this.getAllRefugesEndpoint();
    return this.http.get<Refuge[]>(endpoint).pipe(
      map<Refuge[], GetAllRefugesResponse | Error>((refuges: Refuge[]) => {
        if (isMatching(RefugePattern, refuges.values()))
          return { status: 'correct', data: refuges };
        return {
          status: 'error',
          error: GetAllRefugesErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR,
        };
      }),
      catchError<GetAllRefugesResponse | Error, ObservableInput<any>>(
        (err: HttpErrorResponse) =>
          of({
            status: 'error',
            error: GetAllRefugesErrors.from(err),
          }),
      ),
      retry(3),
    );
  }

  private getAllRefugesEndpoint(): string {
    return `${environment.API}/refuges/`;
  }

  getRefugeFrom(id: string): Observable<GetRefugeResponse> {
    if (!isValidId(id))
      return of({
        status: 'error',
        error: GetRefugeFromIdErrors.CLIENT_SEND_DATA_ERROR,
      });
    return this.getRefugeFromApi(id);
  }

  private getRefugeFromApi(id: string): Observable<GetRefugeResponse> {
    const endpoint = this.getRefugeFromIdEndpoint(id);
    return this.http.get<Refuge>(endpoint).pipe(
      map<Refuge, GetRefugeResponse | Error>((refuge: Refuge) => {
        if (isMatching(RefugePattern, refuge))
          return { status: 'correct', data: refuge };
        return {
          status: 'error',
          error: GetRefugeFromIdErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR,
        };
      }),
      catchError<GetRefugeResponse | Error, ObservableInput<any>>(
        (err: HttpErrorResponse) =>
          of({
            status: 'error',
            error: GetRefugeFromIdErrors.from(err),
          }),
      ),
      retry(3),
    );
  }

  private getRefugeFromIdEndpoint(id: string): string {
    return `${environment.API}/refuges/${id}/`;
  }

  getImageUrlFor(refuge: Refuge): string {
    return `${environment.API}/static/images/refuges/${refuge.image}`;
  }

  deleteRefuge(id: string): Observable<DeleteRefugeResponse> {
    if (!isValidId(id))
      return of({
        status: 'error',
        error: DeleteRefugeFromIdErrors.CLIENT_SEND_DATA_ERROR,
      });
    return this.deleteRefugeFromApi(id);
  }

  private deleteRefugeFromApi(id: string): Observable<DeleteRefugeResponse> {
    const endpoint = this.deleteRefugeFromIdEndpoint(id);
    return this.http.delete<Refuge>(endpoint).pipe(
      map<Refuge, DeleteRefugeResponse | Error>((refuge: Refuge) => {
        if (isMatching(RefugePattern, refuge))
          return { status: 'correct', data: refuge };
        return {
          status: 'error',
          error: DeleteRefugeFromIdErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR,
        };
      }),
      catchError<DeleteRefugeResponse | Error, ObservableInput<any>>(
        (err: HttpErrorResponse) =>
          of({
            status: 'error',
            error: DeleteRefugeFromIdErrors.from(err),
          }),
      ),
      retry(3),
    );
  }

  private deleteRefugeFromIdEndpoint(id: string): string {
    return `${environment.API}/refuges/${id}/`;
  }
}
