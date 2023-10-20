import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgrammingErrorPage } from './programming-error.page';

describe('ProgrammingErrorPage', () => {
  let component: ProgrammingErrorPage;
  let fixture: ComponentFixture<ProgrammingErrorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProgrammingErrorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
