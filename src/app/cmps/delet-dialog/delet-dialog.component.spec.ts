import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletDialogComponent } from './delet-dialog.component';

describe('DeletDialogComponent', () => {
  let component: DeletDialogComponent;
  let fixture: ComponentFixture<DeletDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletDialogComponent]
    });
    fixture = TestBed.createComponent(DeletDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
