import { NgModule } from "@angular/core";
import {
  BrowserModule,
  BrowserTransferStateModule,
} from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { AppModule } from "./app.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: "app-root" }),
    AppModule,
    BrowserTransferStateModule,
    NgbModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
})
export class AppBrowserModule {}
