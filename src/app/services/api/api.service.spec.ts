import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { HackerNews } from 'src/app/model/comments.model';
import { commentsApiMockResponse } from 'src/assets/mock-data/mock-data';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;
  let subscription = new Subscription();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.inject(ApiService);
  });
  afterEach(() => {
    httpTestingController.verify();
    if (subscription) {
      subscription.unsubscribe();
    }
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call GET HTTP request and return data on getHackerNews call', (done) => {
    let expectedResult: HackerNews = commentsApiMockResponse;
    const page = 1;
    subscription = service.getHackerNews(page).subscribe((response) => {
      expectedResult = response as HackerNews;
      expect(response).toEqual(expectedResult);
      done();
    });

    const req = httpTestingController.expectOne(service.apiUrl + page);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedResult);
  });
});
