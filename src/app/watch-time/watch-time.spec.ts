import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchTime } from './watch-time';

describe('WatchTime', () => {
  let component: WatchTime;
  let fixture: ComponentFixture<WatchTime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchTime]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchTime);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
