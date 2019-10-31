import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsEngagementComponent } from './analytics-engagement.component';

describe('AnalyticsEngagementComponent', () => {
  let component: AnalyticsEngagementComponent;
  let fixture: ComponentFixture<AnalyticsEngagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsEngagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsEngagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
