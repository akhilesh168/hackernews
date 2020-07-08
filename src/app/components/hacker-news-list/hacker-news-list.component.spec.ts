import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HackerNewsListComponent } from './hacker-news-list.component';

describe('HackerNewsListComponent', () => {
  let component: HackerNewsListComponent;
  let fixture: ComponentFixture<HackerNewsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HackerNewsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HackerNewsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
