import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaingComponent } from './campaing.component';

describe('CampaingComponent', () => {
  let component: CampaingComponent;
  let fixture: ComponentFixture<CampaingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
