import {inject, TestBed} from '@angular/core/testing';

import {DeploymentService} from './deployment.service';

describe('DeploymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeploymentService]
    });
  });

  it('should be created', inject([DeploymentService], (service: DeploymentService) => {
    expect(service).toBeTruthy();
  }));
});
