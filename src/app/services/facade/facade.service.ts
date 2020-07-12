import { Injectable } from '@angular/core';
import { unionBy } from 'lodash';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { HackerNews, Hit } from 'src/app/model/comments.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class FacadeService {
  private hackerNewsSource = new BehaviorSubject<Hit[]>([]);
  hackerNews$: Observable<Hit[]> = this.hackerNewsSource.asObservable();
  private subscription = new Subscription();
  private previousPage = 1;
  private nextPage = 1;
  chartDataSource = new BehaviorSubject(null);
  private hitArray: Hit[] = [];
  private upVotesArray = [];
  currentPageSource = new BehaviorSubject<number>(1);
  private hiddenArray = [];
  isClicked: boolean;

  constructor(private apiService: ApiService) {}

  getHackerNews(page: number): Observable<HackerNews> {
    return this.apiService.getHackerNews(page);
  }

  setItemInLocalStorage(itemName: string, itemValue: any) {
    localStorage.setItem(itemName, itemValue);
  }

  getItemFromLocalStorage(item: any) {
    return localStorage.getItem(item);
  }
  onDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  /*
  /* initialize the component
  @param
  */
  onComponentInitialized() {
    const currentPageNumber = JSON.parse(
      this.getItemFromLocalStorage('bookmarkPage')
    );
    this.currentPageSource.next(currentPageNumber ? currentPageNumber : 1);
    this.getHackerNewsResponse(this.currentPageSource.value);
  }
  /*
  /* update the ui from filtering data of upVotes and hidden array
  @param
  */
  private dataUpdate() {
    this.upVotesArray = JSON.parse(this.getItemFromLocalStorage('upVotes'));
    this.hiddenArray = JSON.parse(this.getItemFromLocalStorage('hiddenArray'));
    if (this.hackerNewsSource) {
      if (this.upVotesArray && this.upVotesArray.length > 0) {
        this.getFilteredUpVotesArray();
      }
      if (this.hiddenArray && this.hiddenArray.length > 0) {
        this.getFilteredHiddenArray(this.hiddenArray);
      }
    }
  }
  /*
/* return the filtered array of hidden array
@param array : Hit[]
*/
  private getFilteredHiddenArray(array: Hit[]) {
    const unionArray = unionBy(
      this.upVotesArray,
      this.hackerNewsSource.value,
      'objectID'
    );
    const filterArray = unionArray.filter(
      (hitItems) => !array.find((hit) => hitItems.objectID === hit.objectID)
    );
    this.hitArray = [...filterArray];

    this.hackerNewsSource.next(this.hitArray);
    this.initializeChart();
    this.hitArray = [];
  }
  /*
/* return the filtered array of upVotes
@param
*/
  private getFilteredUpVotesArray() {
    this.hackerNewsSource.value.map((hitItems) => {
      this.hitArray.push(hitItems);
    });
    this.hitArray = unionBy(this.upVotesArray, this.hitArray, 'objectID');
    this.hackerNewsSource.next(this.hitArray);
    this.hitArray = [];
  }
  /*
/* updates the chartDataSource
@param
*/
  initializeChart() {
    const labelsArray = [];
    const upVotesArray = [];
    this.hackerNewsSource.value.map((item) => {
      labelsArray.push(item.objectID);
      upVotesArray.push(item.points);
    });
    this.chartDataSource.next({
      labels: labelsArray,
      datasets: [
        {
          label: 'upVotes vs objectId',
          data: upVotesArray,
          fill: false,
          borderColor: '#4bc0c0',
        },
      ],
    });
  }
  /*
/* filters the upVotesArray and provides distinct values from it
@param arr
*/
  private checkDistinctValue(arr: Hit) {
    this.upVotesArray.push(arr);
    this.upVotesArray = this.upVotesArray.filter(
      (data) => data.objectID !== arr.objectID
    );
    this.upVotesArray.push(arr);
  }

  /*
/* increase the upVotes of a story
@param arr
*/
  increaseUpVotes(hit: Hit) {
    this.isClicked = true;
    this.hackerNewsSource.value.map((hitItems) => {
      if (hitItems.objectID === hit.objectID) {
        const newItem = Object.assign({}, hitItems.points++, hitItems);
        this.hitArray.push(newItem);
        this.upVotesArray = this.upVotesArray || [];
        this.checkDistinctValue(newItem);
        this.setItemInLocalStorage(
          'upVotes',
          JSON.stringify(this.upVotesArray)
        );
      } else {
        const newItem = Object.assign({}, hitItems);
        this.hitArray.push(newItem);
      }
      return this.hitArray;
    });
    this.hackerNewsSource.next(this.hitArray);
    this.initializeChart();
    this.hitArray = [];
  }
  /*
/* navigate to previous page
@param
*/
  previous() {
    if (this.nextPage > 1) {
      this.nextPage--;
      this.previousPage = this.nextPage;
      this.currentPageSource.next(this.previousPage);
    }

    this.getHackerNewsResponse(this.previousPage);
  }

  /*
/* return the facade response based on the pageNumber
@param pageNumber
*/
  getHackerNewsResponse(pageNumber) {
    this.getHackerNews(pageNumber).subscribe((items) => {
      this.hackerNewsSource.next(items.hits);
      if (this.hackerNewsSource.value.length > 1) {
        this.dataUpdate();
        this.initializeChart();
      }
    });
  }
  /*
/* navigate to next page
@param
*/
  next() {
    if (this.nextPage < 50) {
      this.nextPage = this.nextPage + 1;
      this.currentPageSource.next(this.nextPage);
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
    const item = this.hackerNewsSource.value;
    removedArray = [...item.filter((data) => data.objectID === hit.objectID)];
    arrayAfterRemovedItem = [
      ...item.filter((data) => data.objectID !== hit.objectID),
    ];
    if (removedArray.length > 0) {
      this.hiddenArray = this.hiddenArray || [];
      this.hiddenArray.push(...removedArray);
    }
    this.setItemInLocalStorage('hiddenArray', JSON.stringify(this.hiddenArray));
    this.hackerNewsSource.next(arrayAfterRemovedItem);
  }
  /*
/*adds bookmark for users
@param
*/
  addToBookmarks() {
    this.setItemInLocalStorage('bookmarkPage', this.currentPageSource.value);
  }
}
