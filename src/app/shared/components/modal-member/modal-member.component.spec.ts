import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMemberComponent } from './modal-member.component';

describe('ModalMemberComponent', () => {
  let component: ModalMemberComponent;
  let fixture: ComponentFixture<ModalMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
