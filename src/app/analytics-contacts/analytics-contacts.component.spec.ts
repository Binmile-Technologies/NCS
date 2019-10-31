import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsContactsComponent } from './analytics-contacts.component';

describe('AnalyticsContactsComponent', () => {
  let component: AnalyticsContactsComponent;
  let fixture: ComponentFixture<AnalyticsContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
