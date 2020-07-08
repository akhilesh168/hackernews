import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartModule } from 'primeng/chart';
import { AppComponent } from './app.component';
import { HackerNewsListComponent } from './components/hacker-news-list/hacker-news-list.component';
import { CachingInterceptor } from './services/Interceptor/cache/caching-interceptor.service';
import { HttpInterceptorService } from './services/Interceptor/http-interceptor.service';

@NgModule({
  declarations: [AppComponent, HackerNewsListComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    ChartModule,
    NgbModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
  ],
})
export class AppModule {}
