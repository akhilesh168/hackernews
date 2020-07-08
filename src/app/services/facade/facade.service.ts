import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HackerNews } from 'src/app/model/comments.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class FacadeService {
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
}
