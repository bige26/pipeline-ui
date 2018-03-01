import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterDeleteModalComponent } from './cluster-delete-modal.component';

describe('ClusterDeleteModalComponent', () => {
  let component: ClusterDeleteModalComponent;
  let fixture: ComponentFixture<ClusterDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
