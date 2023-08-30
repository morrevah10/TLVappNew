import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ImgUploadModalComponent } from './img-upload-modal.component';

describe('ImgUploadModalComponent', () => {
  let component: ImgUploadModalComponent;
  let fixture: ComponentFixture<ImgUploadModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImgUploadModalComponent]
    });
    fixture = TestBed.createComponent(ImgUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
