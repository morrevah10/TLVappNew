import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMessagesComponent } from './user-messages.component';

describe('UserMessagesComponent', () => {
  let component: UserMessagesComponent;
  let fixture: ComponentFixture<UserMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserMessagesComponent]
    });
    fixture = TestBed.createComponent(UserMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
