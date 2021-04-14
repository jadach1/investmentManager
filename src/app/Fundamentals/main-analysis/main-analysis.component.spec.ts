import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAnalysisComponent } from './main-analysis.component';

describe('MainAnalysisComponent', () => {
  let component: MainAnalysisComponent;
  let fixture: ComponentFixture<MainAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
