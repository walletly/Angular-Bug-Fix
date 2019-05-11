import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotsDetailsComponent } from './bots-details.component';

describe('BotsDetailsComponent', () => {
  let component: BotsDetailsComponent;
  let fixture: ComponentFixture<BotsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
