import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotQrComponent } from './bot-qr.component';

describe('BotQrComponent', () => {
  let component: BotQrComponent;
  let fixture: ComponentFixture<BotQrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotQrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
