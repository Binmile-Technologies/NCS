import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedContentComponent } from './recommended-content.component';

describe('RecommendedContentComponent', () => {
  let component: RecommendedContentComponent;
  let fixture: ComponentFixture<RecommendedContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendedContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
