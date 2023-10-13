import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadindComponent } from './loadind.component';

describe('LoadindComponent', () => {
  let component: LoadindComponent;
  let fixture: ComponentFixture<LoadindComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadindComponent]
    });
    fixture = TestBed.createComponent(LoadindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
