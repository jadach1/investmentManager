import { Component, OnInit } from '@angular/core';

import {AnalysisService} from '../../Services/Analyser/analysis.service'
import {MessageService} from '../../Services/Messages/message.service'

import { map }          from 'rxjs/operators';

@Component({
  selector: 'app-data-manager',
  templateUrl: './data-manager.component.html',
  styleUrls: ['./data-manager.component.css']
})



//3.  Test out Map, see if I can map certain categories to statements: income = revenue, balance = cash  
export class DataManagerComponent implements OnInit {

  tempList: {};
  companies: string[];
  selectedCompany: string = "";
  period: string = "year";
  symbol: string;
  statement: string = "";

  tableIncome: string[] =  ["revenue","grossProfit","operatingIncome","netIncome","eps","weightedAverageShsOut"];
  tableBalance: string[] = ["cashAndCashEquivalents","inventory","totalCurrentAssets","propertyPlantEquipmentNet","totalAssets","totalCurrentLiabilities","totalLiabilities","totalEquity"]
  tableCash: string[] =    ["netCashProvidedByOperatingActivities","netCashUsedForInvestingActivites","debtRepayment","netCashUsedProvidedByFinancingActivities","netChangeInCash","capitalExpenditure","freeCashFlow"]

  tableMap: Map<string,string[]>;
  
  constructor(private analService: AnalysisService, 
              public msgService: MessageService) { }

  ngOnInit(): void {
    //Returns an object of "symbols" from the assets table
    this.analService.assetNames()
                    .subscribe(
                                res => this.tempList = res[0],
                                err => console.log("error fetching asset names: " + err),
                                ()  => this.sortIt(this.tempList)
                    )
    this.tableMap = new Map( [["income-statement",this.tableIncome], 
                              ["balance-sheet-statement",this.tableBalance],
                              ["cash-flow-statement",this.tableCash]])
  }

  //Fetches the names of all the assets into an array for display to user
  private sortIt(names: object){
    //Declare the array
    this.companies = new Array<string>();
    //Iterate through the Object we fetched from the DB
    for(const [key, value] of Object.entries(names)) {
      //Grab the symbol from each row in the object
      this.companies.push(names[key].symbol)
    }
  }

  //Sets the name of the Company we will be viewing
  public selectCompanyName(name) {
      this.selectedCompany = name;
  }

  //Sets the period of Data we will be fetching from
  public setPeriod(p: string) {
    if(p != "")
      this.period = p;
  }

  //Get Data from 3rd party API
  public downloadData() {
      console.log(this.statement + "," + this.period + "," + this.selectedCompany)
       //Get Data from API
      let tempArray = this.analService
                      .getFinancialData(this.selectedCompany,this.statement,this.period)
                      .subscribe(
                                  res => tempArray = res,
                                  err => console.log("failed getting financial Data: " + err),
                                  // Manage Data Retrieved
                                  ()  => this.parseData(tempArray,this.statement,this.period)
                                      .then(
                                            // Post Desired data to DB
                                            r => this.analService.postFinancialData(r)
                                                .subscribe(
                                                              r => console.log("posting Financial Info"),
                                                              e => console.log(e)
                                                )
                                            )
                      )
  }

  /*
      THIS FUNCTION receives an array of data from a series of Quarterly or Yearly Financial Statements
      HOW IT WORKS:
        Seperate each statement by Quarter or Year
        Loop through a list of words which represent tables we want to push data into i.e Revenue, EPS, Gross Profit
        Loop through each key of the Individual Report to find a matching word i.e Revenue and Revenue 
    */
  private async parseData(tempArray: Array<any>,statement: string,period: string): Promise<any>{
    if( tempArray == undefined){
      console.log("error, stock you are attempting to retrieve was not found")
      return null;
    } else {
       //Will hold all of the insert statements into the Database
      let arrayOfData = new Array();
       //matches statement to array of table names we want
      let tableNames = this.tableMap.get(statement);
      console.log(tableNames)
      //Loop through each quarter/year of the fetched data
      tempArray.forEach(report => {
        //Loop through each table we are looking for: Revenue, Cash, Debt etc
        tableNames.forEach(table => {
                  //Each key int the report is: Revenue, Cash, Debt etc
                  for (const key in report) {
                    //Loop through each element until it matches the table name i.e Revenue to Revenue Table
                    if( table == key){
                      //Construct a statement
                      let year   = report.date.substring(0,4); 
                      let month  = report.date.substring(5);
                      let symbol  = report.symbol;
                                                                              //report[key] will find the value for what [key] is: revenue, eps, cash
                      let info    = symbol + "," + month + "," + year + "," + report[key];
                      arrayOfData.push(`insert into financials (category,statement,period,symbol_date_value) values('${key}','${statement}','${period}','${info}');`)
                    }
                  } // report loop
        });  //table loop
      });  //tempArray loop
      return arrayOfData;
    }
  }

  

  //Adds a name to the database's list of company names
  public addName() {
    if (this.symbol != ""){
        this.analService.newAssetName(this.symbol)
                      .subscribe(
                                    res => this.msgService.add(res.toString()),
                                    err => this.msgService.add(err.toString())
                      )
    }  
  }

}
