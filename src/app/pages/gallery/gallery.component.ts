import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {
  @Input() images: string[] = [];
  @Input() showGallery: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  currentImageIndex: number = 0;
  totalImages: number = 0;
  isOpen: boolean = false;
  fadeClass: string = '';
  isTransitioning: boolean = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes['images']) {
      this.images = this.images.filter((image) => image !== null);

      this.totalImages = this.images.length;

      if (this.currentImageIndex >= this.totalImages) {
        this.currentImageIndex = 0;
      }
    }

    if (changes['showGallery']) {
      this.isOpen = this.showGallery;
    }
  }

  nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }
  

  prevImage() {
        this.currentImageIndex =
          (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  closeGallery() {
    this.isOpen = false;
    this.close.emit();
  }


}
