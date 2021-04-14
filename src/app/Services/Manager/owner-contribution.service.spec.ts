import { TestBed } from '@angular/core/testing';

import { OwnerContributionService } from './owner-contribution.service';

describe('OwnerContributionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OwnerContributionService = TestBed.get(OwnerContributionService);
    expect(service).toBeTruthy();
  });
});
