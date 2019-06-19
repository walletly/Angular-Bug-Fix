import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastrSuccessComponent } from './toastr-success.component';

describe('ToastrSuccessComponent', () => {
  let component: ToastrSuccessComponent;
  let fixture: ComponentFixture<ToastrSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToastrSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastrSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
