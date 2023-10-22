import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RefugeCreatePage } from './refuge-create.page';

describe('RefugeCreatePage', () => {
  let component: RefugeCreatePage;
  let fixture: ComponentFixture<RefugeCreatePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RefugeCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
