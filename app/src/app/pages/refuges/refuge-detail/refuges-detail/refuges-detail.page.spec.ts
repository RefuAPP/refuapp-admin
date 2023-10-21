import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RefugesDetailPage } from './refuges-detail.page';

describe('RefugesDetailPage', () => {
  let component: RefugesDetailPage;
  let fixture: ComponentFixture<RefugesDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RefugesDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
