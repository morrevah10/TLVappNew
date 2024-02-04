import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDescriptionComponent } from './edit-description.component';

describe('EditDescriptionComponent', () => {
  let component: EditDescriptionComponent;
  let fixture: ComponentFixture<EditDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDescriptionComponent]
    });
    fixture = TestBed.createComponent(EditDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
