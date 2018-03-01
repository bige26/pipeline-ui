import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotguideComponent } from './spotguide.component';

describe('SpotguideComponent', () => {
  let component: SpotguideComponent;
  let fixture: ComponentFixture<SpotguideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotguideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotguideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
