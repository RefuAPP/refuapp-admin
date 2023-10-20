import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { from, lastValueFrom, Observable } from 'rxjs';
import { StorageService } from '../services/storage/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return from(this.addToken(request, next));
  }

  private async addToken(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Promise<HttpEvent<any>> {
    const token = await this.storageService.get('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return await lastValueFrom(next.handle(request));
  }
}
