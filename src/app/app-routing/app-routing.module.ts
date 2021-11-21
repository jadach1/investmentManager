import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {AppComponent}               from '../app.component'
import {DashboardFundComponent}     from '../Fundamentals/dashboard-fund/dashboard-fund.component'
import {ManagerDashboardComponent}  from '../Management/manager-dashboard/manager-dashboard.component'
import {AssetDashboardComponent}    from '../Management/asset-dashboard/asset-dashboard.component';
import {AssetDetailsComponent}      from '../Management/asset-details/asset-details.component';


const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: AppComponent},
    {path: 'dashboardFund', component: DashboardFundComponent},
    {path: 'dashboardManagement', component: ManagerDashboardComponent},
    {path: 'assetdetails/:id', component: AssetDetailsComponent},
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
