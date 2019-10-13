import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryFinanceComponent } from './ministry-finance.component';

describe('MinistryFinanceComponent', () => {
  let component: MinistryFinanceComponent;
  let fixture: ComponentFixture<MinistryFinanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinistryFinanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinistryFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
