import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-dialog-upload-image',
  templateUrl: './dialog-upload-image.component.html',
  styleUrls: ['./dialog-upload-image.component.scss']
})
export class DialogUploadImageComponent implements OnInit {

  @Input('image') image;
  @Input('uploadType') uploadType;
  @Output('closeEmit') closeEmit = new EventEmitter;
  @Output('uploadEmit') uploadEmit = new EventEmitter;

  imageChangedEvent;
  croppedImage: any = '';
  pro;

  close() {
    this.closeEmit.emit(false);
  }

  upload() {
    this.uploadEmit.emit(this.croppedImage);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.file;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  constructor() { }

  ngOnInit() {
    this.imageChangedEvent = this.image;
  }

}
