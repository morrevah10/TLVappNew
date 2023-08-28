import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RantalComponent } from './rantal.component';

describe('RantalComponent', () => {
  let component: RantalComponent;
  let fixture: ComponentFixture<RantalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RantalComponent]
    });
    fixture = TestBed.createComponent(RantalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
