import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangPasswordComponent } from './chang-password.component';

describe('ChangPasswordComponent', () => {
  let component: ChangPasswordComponent;
  let fixture: ComponentFixture<ChangPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangPasswordComponent]
    });
    fixture = TestBed.createComponent(ChangPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
