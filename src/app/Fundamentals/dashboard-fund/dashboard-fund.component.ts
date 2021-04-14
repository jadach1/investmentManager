import { newArray } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-fund',
  templateUrl: './dashboard-fund.component.html',
  styleUrls: ['./dashboard-fund.component.css']
})
export class DashboardFundComponent implements OnInit {
  selectionList: string[];

  constructor() { 

  }

  ngOnInit(): void {
      this.selectionList = new Array()
      this.selectionList.push("MSFT")
      this.selectionList.push("AMZN","APPL")
  }

  public trialRun(name: String){
      alert("We are in trial run " + name)
  }
}
