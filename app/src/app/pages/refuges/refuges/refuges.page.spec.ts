import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RefugesPage } from './refuges.page';

describe('RefugesPage', () => {
  let component: RefugesPage;
  let fixture: ComponentFixture<RefugesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RefugesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
