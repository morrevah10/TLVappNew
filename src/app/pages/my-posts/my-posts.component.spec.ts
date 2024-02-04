import { ComponentFixture, TestBed } from '@angular/core/testing';

import { myPostsComponent } from './my-posts.component';

describe('RmyPostsComponent', () => {
  let component: myPostsComponent;
  let fixture: ComponentFixture<myPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [myPostsComponent]
    });
    fixture = TestBed.createComponent(myPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
