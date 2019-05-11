import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletlyCardsComponent } from './walletly-cards.component';

describe('WalletlyCardsComponent', () => {
  let component: WalletlyCardsComponent;
  let fixture: ComponentFixture<WalletlyCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletlyCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletlyCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
