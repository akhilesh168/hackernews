import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl = `https://hn.algolia.com/api/v1/search?tags=comment&page=`;
  constructor(private http: HttpClient) {}
  getHackerNews<HackerNews>(page: number): Observable<HackerNews> {
    return this.http.get<HackerNews>(this.apiUrl + page);
  }
}
