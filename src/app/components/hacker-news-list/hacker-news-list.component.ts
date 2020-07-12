import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Hit } from 'src/app/model/comments.model';
import { FacadeService } from 'src/app/services/facade/facade.service';
@Component({
  selector: 'app-hacker-news-list',
  templateUrl: './hacker-news-list.component.html',
  styleUrls: ['./hacker-news-list.component.scss'],
})
export class HackerNewsListComponent implements OnInit, OnDestroy {
  hackerNews$: Observable<Hit[]>;
  chartData: any;
  currentPage = 1;
  isBrowser: boolean;
  isClicked: boolean;
  constructor(
    private hackerNewsFacade: FacadeService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.hackerNewsFacade.onComponentInitialized();
    this.hackerNewsFacade.chartDataSource.subscribe((data) => {
      this.chartData = data;
    });
    this.hackerNews$ = this.hackerNewsFacade.hackerNews$;
  }

  ngOnDestroy() {
    this.hackerNewsFacade.onDestroy();
  }

  /*
  /* increase the upVotes of a story
  @param arr
  */
  increaseUpVotes(hit: Hit) {
    this.hackerNewsFacade.increaseUpVotes(hit);
    this.isClicked = this.hackerNewsFacade.isClicked;
  }
  /*
  /* navigate to previous page
  @param
  */
  previous() {
    this.hackerNewsFacade.previous();
    this.currentPage = this.hackerNewsFacade.currentPageSource.value;
  }

  /*
  /* navigate to next page
  @param
  */
  next() {
    this.hackerNewsFacade.next();
    this.currentPage = this.hackerNewsFacade.currentPageSource.value;
  }
  /*
  /* redirect page to given url
  @param
  */
  redirectToPageUrl(url: string) {
    this.hackerNewsFacade.redirectToPageUrl(url);
  }
  /*
  /* hides the item from news feed
  @param
  */
  removeItem(hit: Hit) {
    this.hackerNewsFacade.removeItem(hit);
  }

  addToBookmarks() {
    this.hackerNewsFacade.addToBookmarks();
  }
}
