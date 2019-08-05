import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignIntegrationComponent } from './campaign-integration.component';

describe('CampaignIntegrationComponent', () => {
  let component: CampaignIntegrationComponent;
  let fixture: ComponentFixture<CampaignIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
