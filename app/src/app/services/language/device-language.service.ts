import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { distinctUntilChanged, map, mergeMap, Observable, timer } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { StorageService } from '../storage/storage.service';
import { TranslateService } from '@ngx-translate/core';

const LANGUAGE_KEY = 'language';

@Injectable({
  providedIn: 'root',
})
export class DeviceLanguageService {
  constructor(
    private storageService: StorageService,
    private translateService: TranslateService,
  ) {}

  async getCurrentLanguageCode(): Promise<string> {
    const languageCode = await this.storageService.get(LANGUAGE_KEY);
    if (languageCode) return languageCode;
    return Device.getLanguageCode().then((languageTag) => languageTag.value);
  }

  /**
   * Gets the language code of the device, fetching it every 3 seconds.
   * TODO: This is a workaround for the fact that Capacitor's Device plugin
   * doesn't have an observable for getting the language code, so we have to
   * poll it every 3 seconds.
   */
  getLanguageCode(): Observable<string> {
    return timer(0, 3_000).pipe(
      mergeMap(() => fromPromise(this.getCurrentLanguageCode())),
      distinctUntilChanged(),
    );
  }

  async setLanguageCode(languageCode: string): Promise<void | never> {
    const languageCodes = await this.getLanguagesCodes();
    if (!languageCodes.includes(languageCode))
      throw new Error(`Language code ${languageCode} not supported`);
    await this.storageService.set(LANGUAGE_KEY, languageCode);
  }

  async getLanguagesCodes(): Promise<string[]> {
    return this.translateService.getLangs();
  }
}
