import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RefugesListPage } from './refuges-list.page';

describe('RefugesPage', () => {
  let component: RefugesListPage;
  let fixture: ComponentFixture<RefugesListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RefugesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
