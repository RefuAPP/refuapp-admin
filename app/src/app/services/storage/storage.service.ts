import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public async set(key: string, value: any): Promise<void> {
    await Preferences.set({ key, value });
  }

  public async get(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value;
  }

  public async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  }
}
