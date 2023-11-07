import { TestBed } from '@angular/core/testing';

import { DeviceLanguageService } from './device-language.service';

describe('DeviceLanguageService', () => {
  let service: DeviceLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
