import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Token } from '../../schemas/auth/token';
import { catchError, map, Observable, of, retry } from 'rxjs';
import {
  AuthenticationResponse,
  fromError,
  fromResponse,
} from '../../schemas/auth/authenticate';
import { environment } from '../../../environments/environment';

const authUri = `${environment.API}/login/`;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private storageService: StorageService,
    private http: HttpClient,
  ) {}

  async authenticate(token: Token) {
    await this.storageService.set('token', token);
  }

  async deAuthenticate(): Promise<void> {
    if (await this.isAuthenticated()) await this.storageService.remove('token');
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.storageService.get('token');
    return token != null;
  }

  private getTokenFromApi(data: FormData): Observable<AuthenticationResponse> {
    return this.http.post<Token>(authUri, data).pipe(
      map((response: Token) => fromResponse(response)),
      catchError((err: HttpErrorResponse) => of(fromError(err))),
      retry(3),
    );
  }
}
