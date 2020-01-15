import { TestBed } from '@angular/core/testing';

import { UploadpictureService } from './uploadpicture.service';

describe('UploadpictureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadpictureService = TestBed.get(UploadpictureService);
    expect(service).toBeTruthy();
  });
});
