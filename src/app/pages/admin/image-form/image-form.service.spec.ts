import { TestBed, inject } from '@angular/core/testing';

import { ImageFormService } from './image-form.service';

describe('ImageFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageFormService]
    });
  });

  it('should be created', inject([ImageFormService], (service: ImageFormService) => {
    expect(service).toBeTruthy();
  }));
});
