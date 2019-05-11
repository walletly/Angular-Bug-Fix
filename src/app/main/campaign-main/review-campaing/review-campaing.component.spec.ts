import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCampaingComponent } from './review-campaing.component';

describe('ReviewCampaingComponent', () => {
  let component: ReviewCampaingComponent;
  let fixture: ComponentFixture<ReviewCampaingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewCampaingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCampaingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
