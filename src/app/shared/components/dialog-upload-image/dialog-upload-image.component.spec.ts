import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUploadImageComponent } from './dialog-upload-image.component';

describe('DialogUploadImageComponent', () => {
  let component: DialogUploadImageComponent;
  let fixture: ComponentFixture<DialogUploadImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUploadImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUploadImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
