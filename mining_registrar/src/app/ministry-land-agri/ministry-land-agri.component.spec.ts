import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryLandAgriComponent } from './ministry-land-agri.component';

describe('MinistryLandAgriComponent', () => {
  let component: MinistryLandAgriComponent;
  let fixture: ComponentFixture<MinistryLandAgriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinistryLandAgriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinistryLandAgriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
