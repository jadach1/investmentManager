import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFundComponent } from './dashboard-fund.component';

describe('DashboardFundComponent', () => {
  let component: DashboardFundComponent;
  let fixture: ComponentFixture<DashboardFundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardFundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
