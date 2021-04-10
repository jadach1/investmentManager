import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-fund',
  templateUrl: './dashboard-fund.component.html',
  styleUrls: ['./dashboard-fund.component.css']
})
export class DashboardFundComponent implements OnInit {
  selectionList: string[];

  constructor() { 
    this.selectionList.push("Microsoft")
    this.selectionList.push("Google")
    this.selectionList.push("Apple","Amazon")
  }

  ngOnInit(): void {
  }

}
