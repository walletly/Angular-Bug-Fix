import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotsStoreComponent } from './bots-store.component';

describe('BotsStoreComponent', () => {
  let component: BotsStoreComponent;
  let fixture: ComponentFixture<BotsStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotsStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotsStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
