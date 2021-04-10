import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule }     from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { DashboardFundComponent } from './Fundamentals/dashboard-fund/dashboard-fund.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardFundComponent,
  ],
  imports: [
    BrowserModule, NgbModule, AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent, DashboardFundComponent]
})
export class AppModule { }
