import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretCreateComponent } from './secret-create.component';

describe('SecretCreateComponent', () => {
  let component: SecretCreateComponent;
  let fixture: ComponentFixture<SecretCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecretCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
