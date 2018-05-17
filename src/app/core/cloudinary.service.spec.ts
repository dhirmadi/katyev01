import { TestBed, inject } from '@angular/core/testing';

import { CloudinaryServiceService } from './cloudinary-service.service';

describe('CloudinaryServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CloudinaryServiceService]
    });
  });

  it('should be created', inject([CloudinaryServiceService], (service: CloudinaryServiceService) => {
    expect(service).toBeTruthy();
  }));
});
