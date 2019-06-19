import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUpgradeComponent } from './dialog-upgrade.component';

describe('DialogUpgradeComponent', () => {
  let component: DialogUpgradeComponent;
  let fixture: ComponentFixture<DialogUpgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUpgradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
