import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotsListComponent } from './bots-list.component';

describe('BotsListComponent', () => {
  let component: BotsListComponent;
  let fixture: ComponentFixture<BotsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
