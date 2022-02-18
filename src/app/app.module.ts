import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule }     from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule }         from '@angular/common/http';
import { ReactiveFormsModule, 
         FormsModule }               from '@angular/forms';
import { AppRoutingModule }          from './app-routing/app-routing.module';
import {  ToastrModule }             from 'ngx-toastr'
import {BrowserAnimationsModule}     from '@angular/platform-browser/animations'
import {MatSliderModule} from '@angular/material/slider'


import { AppComponent }              from './app.component';
import { MainAnalysisComponent }     from './Fundamentals/main-analysis/main-analysis.component';
import { ManagerDashboardComponent } from './Management/manager-dashboard/manager-dashboard.component';
import { AssetDashboardComponent }   from './Management/asset-dashboard/asset-dashboard.component';
import {AssetDetailsComponent}       from './Management/asset-details/asset-details.component';
import { AddTransactionComponent }   from './Management/add-transaction/add-transaction.component';
import { DataManagerComponent }      from  './Fundamentals/data-manager/data-manager.component';
import { TransactionsComponent }     from './Management/transactions/transactions.component';
import { MessagesComponent }         from './Misc/messages/messages.component';
import { AnalysisSearchCriteriaComponent }   from './Fundamentals/main-analysis/SearchOptions/analysis-search-criteria/analysis-search-criteria.component';
import { DisplaySingleCompanyComponent }     from './Fundamentals/main-analysis/Display/display-single-company/display-single-company.component';
import { CustomDropdownDirective }           from './Directives/custom-dropdown.directive';
import { DisplayAdvanceComponent }           from './Fundamentals/main-analysis/Display/display-advance/display-advance.component';
import { DisplayAdvancedTableComponent } from './Fundamentals/main-analysis/Display/display-advance/display-advanced-table/display-advanced-table.component';

@NgModule({
  declarations: [
    AppComponent,
    MainAnalysisComponent,
    ManagerDashboardComponent,
    AssetDashboardComponent,
    AssetDetailsComponent,
    AddTransactionComponent,
    DataManagerComponent,
    TransactionsComponent,
    MessagesComponent,
    AnalysisSearchCriteriaComponent,
    DisplaySingleCompanyComponent,
    CustomDropdownDirective,
    DisplayAdvanceComponent,
    DisplayAdvancedTableComponent,
  ],
  imports: [
    BrowserModule, 
    NgbModule, 
    AppRoutingModule, 
    HttpClientModule,  
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({  
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true, }),
    BrowserAnimationsModule,
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
