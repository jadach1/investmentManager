import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule }     from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { DashboardFundComponent } from './Fundamentals/dashboard-fund/dashboard-fund.component';
import { MainAnalysisComponent } from './Fundamentals/main-analysis/main-analysis.component';
import { ManagerDashboardComponent } from './Management/manager-dashboard/manager-dashboard.component';
import { AssetDashboardComponent } from './Management/asset-dashboard/asset-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardFundComponent,
    MainAnalysisComponent,
    ManagerDashboardComponent,
    AssetDashboardComponent,
  ],
  imports: [
    BrowserModule, NgbModule, AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent, DashboardFundComponent]
})
export class AppModule { }
