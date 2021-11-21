import { TestBed } from '@angular/core/testing';

import { ColourGeneratorService } from './colour-generator.service';

describe('ColourGeneratorService', () => {
  let service: ColourGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColourGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
