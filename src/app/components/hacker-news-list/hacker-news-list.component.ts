import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { unionBy } from 'lodash';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Hit } from 'src/app/model/comments.model';
import { FacadeService } from 'src/app/services/facade/facade.service';
@Component({
  selector: 'app-hacker-news-list',
  templateUrl: './hacker-news-list.component.html',
  styleUrls: ['./hacker-news-list.component.scss'],
})
export class HackerNewsListComponent implements OnInit, OnDestroy {
  hackerNews$: Observable<Hit[]>;
  private subscription = new Subscription();
  previousPage = 1;
  nextPage = 1;
  chartData: any;
  private hitArray: Hit[] = [];
  upVotesArray = [];
  private hiddenArray = [];

  constructor(
    private hackerNewsFacade: FacadeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.hackerNews$ = this.hackerNewsFacade
      .getHackerNews(1)
      .pipe(map((items) => items.hits));
    this.dataUpdate();
    this.initializeChart();
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  /*
  /* update the ui from filtering data of upVotes and hidden array
  @param
  */
  private dataUpdate() {
    this.upVotesArray = JSON.parse(
      this.hackerNewsFacade.getItemFromLocalStorage('upVotes')
    );
    this.hiddenArray = JSON.parse(
      this.hackerNewsFacade.getItemFromLocalStorage('hiddenArray')
    );

    if (this.upVotesArray && this.upVotesArray.length > 0) {
      this.getFilteredUpVotesArray();
    }
    if (this.hiddenArray && this.hiddenArray.length > 0) {
      this.getFilteredHiddenArray(this.hiddenArray);
    }
  }
  /*
  /* return the filtered array of hidden array
  @param array : Hit[]
  */
  private getFilteredHiddenArray(array: Hit[]) {
    this.subscription.add(
      this.hackerNews$
        .pipe(
          map((items) => {
            const unionArray = unionBy(this.upVotesArray, items, 'objectID');
            const filterArray = unionArray.filter(
              (hitItems) =>
                !array.find((hit) => hitItems.objectID === hit.objectID)
            );
            this.hitArray = [...filterArray];
          })
        )
        .subscribe(() => {
          this.hackerNews$ = of(this.hitArray);
          this.initializeChart();
          this.hitArray = [];
        })
    );
  }
  /*
  /* return the filtered array of upVotes
  @param
  */
  private getFilteredUpVotesArray() {
    this.subscription.add(
      this.hackerNews$
        .pipe(
          map((hitItems) =>
            hitItems.map((item) => {
              this.hitArray.push(item);
            })
          )
        )
        .subscribe(() => {
          this.hitArray = unionBy(this.upVotesArray, this.hitArray, 'objectID');
          this.hackerNews$ = of(this.hitArray);
          this.hitArray = [];
        })
    );
  }
  /*
  /* updates the chartData
  @param
  */
  private initializeChart() {
    this.hackerNews$.subscribe((data) => {
      const labelsArray = [];
      const upVotesArray = [];
      data.map((item) => {
        labelsArray.push(item.objectID);
        upVotesArray.push(item.points);
      });
      this.chartData = {
        labels: labelsArray,
        datasets: [
          {
            label: 'upVotes vs objectId',
            data: upVotesArray,
            fill: false,
            borderColor: '#4bc0c0',
          },
        ],
      };
    });
  }
  /*
  /* updates the upVotesArray
  @param arr
  */
  private checkDistinctValue(arr: Hit) {
    this.upVotesArray.push(arr);
    this.upVotesArray = this.upVotesArray.filter(
      (data) => data.objectID !== arr.objectID
    );
    this.upVotesArray.push(arr);
  }
  increaseUpVotes(hit: Hit) {
    this.subscription.add(
      this.hackerNews$
        .pipe(
          map((items) => {
            items.map((hitItems) => {
              if (hitItems.objectID === hit.objectID) {
                const newItem = Object.assign({}, hitItems.points++, hitItems);
                this.hitArray.push(newItem);
                this.upVotesArray = this.upVotesArray || [];
                this.checkDistinctValue(newItem);
                this.hackerNewsFacade.setItemInLocalStorage(
                  'upVotes',
                  JSON.stringify(this.upVotesArray)
                );
              } else {
                const newItem = Object.assign({}, hitItems);
                this.hitArray.push(newItem);
              }
              return this.hitArray;
            });
          })
        )
        .subscribe((data) => {
          this.hackerNews$ = of(this.hitArray);
          this.initializeChart();
          this.hitArray = [];
        })
    );
  }
  /*
  /* navigate to previous page
  @param
  */
  previous() {
    if (this.nextPage > 1) {
      this.nextPage--;
      this.previousPage = this.nextPage;
    }
    this.getHackerNewsResponse(this.previousPage);
  }

  /*
  /* return the facade response based on the pageNumber
  @param pageNumber
  */
  getHackerNewsResponse(pageNumber) {
    this.hackerNews$ = this.hackerNewsFacade
      .getHackerNews(pageNumber)
      .pipe(map((item) => item.hits));
    this.dataUpdate();
    this.initializeChart();
  }
  /*
  /* navigate to next page
  @param
  */
  next() {
    if (this.nextPage < 50) {
      this.nextPage = this.nextPage + 1;
    }
    this.getHackerNewsResponse(this.nextPage);
  }
  /*
  /* redirect page to given url
  @param
  */
  redirectToPageUrl(url: string) {
    if (url) {
      window.open(url, 'blank');
    }
  }
  /*
  /* hides the item from news feed
  @param
  */
  removeItem(hit: Hit) {
    let removedArray = [];
    let arrayAfterRemovedItem = [];
    this.hackerNews$
      .pipe(
        map((item) => {
          removedArray = [
            ...item.filter((data) => data.objectID === hit.objectID),
          ];
          arrayAfterRemovedItem = [
            ...item.filter((data) => data.objectID !== hit.objectID),
          ];
        })
      )
      .subscribe(() => {
        if (removedArray.length > 0) {
          this.hiddenArray = this.hiddenArray || [];
          this.hiddenArray.push(...removedArray);
        }
        this.hackerNewsFacade.setItemInLocalStorage(
          'hiddenArray',
          JSON.stringify(this.hiddenArray)
        );
        this.hackerNews$ = of(arrayAfterRemovedItem);
      });
  }
}
