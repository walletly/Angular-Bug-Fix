import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketersComponent } from './marketers.component';

describe('MarketersComponent', () => {
  let component: MarketersComponent;
  let fixture: ComponentFixture<MarketersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
