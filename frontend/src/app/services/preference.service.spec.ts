import { TestBed } from '@angular/core/testing';

import { PreferenceService } from './preference.service';

describe('PreferenceService', () => {
  let service: PreferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreferenceService);
  });
});
