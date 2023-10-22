import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RefugeUdpatePage } from './refuge-udpate.page';

describe('RefugeUdpatePage', () => {
  let component: RefugeUdpatePage;
  let fixture: ComponentFixture<RefugeUdpatePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RefugeUdpatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
