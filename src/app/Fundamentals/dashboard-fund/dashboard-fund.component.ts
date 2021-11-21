import { Component, OnInit } from '@angular/core';
import {AnalysisService} from '../../Services/Analyser/analysis.service'

@Component({
  selector: 'app-dashboard-fund',
  templateUrl: './dashboard-fund.component.html',
  styleUrls: ['./dashboard-fund.component.css']
})
export class DashboardFundComponent implements OnInit {
  dataGet = false;
  dataDisplay = false

  constructor(private analService: AnalysisService) { 

  }

  ngOnInit(): void {
  }

 public flipView(state: string){
    switch (state){
      case 'get': 
                  this.dataGet = true; 
                  this.dataDisplay = false;
                  break;
      case 'display': 
                  this.dataDisplay = true; 
                  this.dataGet = false; 
                  break;
    }
 }
}