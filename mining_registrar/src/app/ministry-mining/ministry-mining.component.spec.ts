import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryMiningComponent } from './ministry-mining.component';

describe('MinistryMiningComponent', () => {
  let component: MinistryMiningComponent;
  let fixture: ComponentFixture<MinistryMiningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinistryMiningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinistryMiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
