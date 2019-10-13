import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningCompanyComponent } from './mining-company.component';

describe('MiningCompanyComponent', () => {
  let component: MiningCompanyComponent;
  let fixture: ComponentFixture<MiningCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiningCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiningCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
