import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {AppComponent}                    from '../app.component'
import {ManagerDashboardComponent}       from '../Management/manager-dashboard/manager-dashboard.component'
import {AssetDashboardComponent}         from '../Management/asset-dashboard/asset-dashboard.component';
import {AssetDetailsComponent}           from '../Management/asset-details/asset-details.component';
import {DataManagerComponent}            from '../Fundamentals/data-manager/data-manager.component'
import {MainAnalysisComponent}           from '../Fundamentals/main-analysis/main-analysis.component'
import {AnalysisSearchCriteriaComponent} from '../Fundamentals/main-analysis/SearchOptions/analysis-search-criteria/analysis-search-criteria.component'
import { DisplaySingleCompanyComponent } from '../Fundamentals/main-analysis/Display/display-single-company/display-single-company.component';
import { DisplayAdvanceComponent } from '../Fundamentals/main-analysis/Display/display-advance/display-advance.component';

const routes: Routes = [
    // {path: '', redirectTo: '/home', pathMatch: 'full'},
    // {path: 'home', component: AppComponent},
    // {path: 'dashboardFund', component: DashboardFundComponent, 
    //         children: [
    //           {path: 'FetchNewData', component: DataManagerComponent},
    //           {path: 'DisplayCompanyData', component: MainAnalysisComponent}
    //         ]},
    {path: 'dashboardManagement', component: ManagerDashboardComponent},
    {path: 'assetdetails/:id',    component: AssetDetailsComponent},
    {path: 'fetchData',           component: DataManagerComponent},
    {path: 'displayData',         component: MainAnalysisComponent, children: [
                { path: 'SearchCriteria', component: AnalysisSearchCriteriaComponent},
                { path: 'displaySingle', component: DisplaySingleCompanyComponent},
                { path: 'displayAdvanced', component: DisplayAdvanceComponent}
    ]}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
