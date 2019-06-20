import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardInfoAdminComponent } from './dashboard-info-admin.component';

describe('DashboardInfoAdminComponent', () => {
  let component: DashboardInfoAdminComponent;
  let fixture: ComponentFixture<DashboardInfoAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardInfoAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardInfoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
