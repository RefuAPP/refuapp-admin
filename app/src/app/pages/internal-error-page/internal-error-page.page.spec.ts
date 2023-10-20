import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalErrorPagePage } from './internal-error-page.page';

describe('InternalErrorPagePage', () => {
  let component: InternalErrorPagePage;
  let fixture: ComponentFixture<InternalErrorPagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InternalErrorPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
