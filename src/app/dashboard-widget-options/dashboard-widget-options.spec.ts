import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardWidgetOptions } from './dashboard-widget-options';

describe('DashboardWidgetOptions', () => {
  let component: DashboardWidgetOptions;
  let fixture: ComponentFixture<DashboardWidgetOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardWidgetOptions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardWidgetOptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
