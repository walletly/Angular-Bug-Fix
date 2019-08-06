import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCampaignComponent } from './shared-campaign.component';

describe('SharedCampaignComponent', () => {
  let component: SharedCampaignComponent;
  let fixture: ComponentFixture<SharedCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
