import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OpeningComponent } from './opening.component';

describe('OpeningComponent', () => {
  let component: OpeningComponent;
  let fixture: ComponentFixture<OpeningComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpeningComponent],
      imports: [RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(OpeningComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the first stage', () => {
    expect(component.currentStage).toBe(0);
    expect(component.stages[component.currentStage].title).toBe('ברוכים הבאים לRent Share');
  });

  it('should navigate to next stage', () => {
    component.nextStage();
    expect(component.currentStage).toBe(1);
  });

  it('should navigate to previous stage', () => {
    component.currentStage = 1;
    component.previousStage();
    expect(component.currentStage).toBe(0);
  });

  it('should set "hasVisited" in localStorage and navigate to login on skip', () => {
    spyOn(localStorage, 'setItem');
    spyOn(router, 'navigate');
    component.skipToLogin();
    expect(localStorage.setItem).toHaveBeenCalledWith('hasVisited', 'true');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set "hasVisited" in localStorage on last stage', () => {
    component.currentStage = 2;
    spyOn(localStorage, 'setItem');
    component.nextStage();
    expect(localStorage.setItem).toHaveBeenCalledWith('hasVisited', 'true');
  });
});
