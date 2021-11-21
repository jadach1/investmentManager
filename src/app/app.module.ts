import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule }     from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule }         from '@angular/common/http';
import { ReactiveFormsModule, 
          FormsModule }             from '@angular/forms';

import { AppComponent }              from './app.component';
import { AppRoutingModule }          from './app-routing/app-routing.module';
import { DashboardFundComponent }    from './Fundamentals/dashboard-fund/dashboard-fund.component';
import { MainAnalysisComponent }     from './Fundamentals/main-analysis/main-analysis.component';
import { ManagerDashboardComponent } from './Management/manager-dashboard/manager-dashboard.component';
import { AssetDashboardComponent }   from './Management/asset-dashboard/asset-dashboard.component';
import {AssetDetailsComponent}       from './Management/asset-details/asset-details.component';
import { AddTransactionComponent } from './Management/add-transaction/add-transaction.component';
import { DataManagerComponent } from './Fundamentals/data-manager/data-manager.component';
import { TransactionsComponent } from './Management/transactions/transactions.component';
import { MessagesComponent } from './Misc/messages/messages.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardFundComponent,
    MainAnalysisComponent,
    ManagerDashboardComponent,
    AssetDashboardComponent,
    AssetDetailsComponent,
    AddTransactionComponent,
    DataManagerComponent,
    TransactionsComponent,
    MessagesComponent,
  ],
  imports: [
    BrowserModule, 
    NgbModule, 
    AppRoutingModule, 
    HttpClientModule,  
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
