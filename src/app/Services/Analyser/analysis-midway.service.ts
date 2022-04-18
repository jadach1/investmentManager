import { Injectable, EventEmitter } from '@angular/core';
import {map}                  from 'rxjs/operators'
import { Observable, Subject }         from 'rxjs';

import {MessageService}          from '../../Services/Messages/message.service'
import {AnalysisService}         from './analysis.service'

import {Company, CompanyResults} from '../../../Models/Analyser/Company'
import { IncomingMessage } from 'http';

@Injectable({
  providedIn: 'root'
})
export class AnalysisMidwayService  {
  /******  GET NEW COMPANY FINANCIAL INFORMATION ******/
  //holds list of company names
  companies: string[];
  //tableMap should hold all the values of income, balance and cash Tables
  tableMap: Map<string,string[]>;
  tableIncome: string[] =  ["revenue","grossProfit","operatingIncome","netIncome","eps","weightedAverageShsOut"];
  tableBalance: string[] = ["cashAndCashEquivalents","inventory","totalCurrentAssets","propertyPlantEquipmentNet","totalAssets","totalCurrentLiabilities","totalLiabilities","totalEquity"]
  tableCash: string[] =    ["netCashProvidedByOperatingActivities","netCashUsedForInvestingActivites","debtRepayment","netCashUsedProvidedByFinancingActivities","netChangeInCash","capitalExpenditure","freeCashFlow"]
  
  /****** LIST OF COMPANY FINANCIALS ******/
   idCounter: number = 1 // used for the ID property in CompanyResults
   company: CompanyResults = new CompanyResults();
   companyMasterList: CompanyResults[] = [];
   referenceCompanyMasterList: string[] = [];
  // Similar to Obervable; to send companyMasterList across components
   sharedMasterList  = new Subject<CompanyResults[]>();
   sharedUserSelectedMasterList: CompanyResults[] = [];
  

  constructor(private analService: AnalysisService, public msgService: MessageService) {
    this.tableMap = new Map( [["income-statement",this.tableIncome], 
                              ["balance-sheet-statement",this.tableBalance],
                              ["cash-flow-statement",this.tableCash]])
  }

  /* --------------- GET NEW COMPANY FINANCIAL INFORMATION----------------------- */

  // Retrieves a list of company names from the DB
  // Parses them into an Array of Strings, returns an Observable
  public getAssetNames(): Observable<Array<string>> {
        //Returns an object of "symbols" from the assets table
       return this.analService.assetNames()
        .pipe(map(names => {
                         this.companies = new Array<string>();
                        //Iterate through the Object we fetched from the DB
                        for(const [key, value] of Object.entries(names[0])) {
                         // console.log(names[0][key].symbol + " " + key)
                          //Grab the symbol from each row in the object
                          this.companies.push(names[0][key].symbol)
                        }
                        return this.companies;
        }))
  }
  
  /*
      THIS FUNCTION receives an array of data from an API of Quarterly or Yearly Financial Statements
      HOW IT WORKS:
        Seperate each statement by Quarter or Year
        Loop through a list of words which represent tables we want to push data into i.e Revenue, EPS, Gross Profit
        Loop through each keyword of the Individual Report to find a matching word i.e Revenue and Revenue
        Creates an array of strings, each representing an insert statement which we will send to DB 
    */
   public async parseFinancialData(tempArray: Array<any>,statement: string,period: string): Promise<Array<string>>{
    if( tempArray == undefined){
      console.log("error, stock you are attempting to retrieve was not found")
      return null;
    } else {
       //Will hold all of the insert statements into the Database
      let arrayOfData = new Array<string>();
       //matches statement to array of table names we want
      let tableNames = this.tableMap.get(statement);
      //Loop through each quarter/year of the fetched data
      tempArray.forEach(report => {
        //Loop through each table we are looking for: Revenue, Cash, Debt etc
        tableNames.forEach(table => {
                  //Each key int the report is: Revenue, Cash, Debt etc
                  for (const key in report) {
                    //Loop through each element until it matches the table name i.e Revenue to Revenue Table
                    if( table == key){
                      //Construct a statement
                      let year: number   =  report.date.substring(0,4); 
                      let month: number  =  report.date.substring(5);
                      let symbol: string =  report.symbol;
                      let value: number  =  +report[key];

                       //If EPS truncate to 2 decimal places
                       if(table === "eps"){
                        console.log("eps")
                        value = +value.toFixed(2);
                      } if (table === "EPS"){
                        console.log("EPS")
                        value = +value.toFixed(2);
                      }
                                                                              //report[key] will find the value for what [key] is: revenue, eps, cash
                      let info    = symbol + "," + month + "," + year + "," + value;
                      arrayOfData.push(`insert into financials (category,statement,period,symbol_date_value) values('${key}','${statement}','${period}','${info}');`)
                    }
                  } // report loop
        });  //table loop
      });  //tempArray loop
      return arrayOfData;
    }
  }

  .create a new model profile
  . get data, returns an observable, subscribe
  . pipe the data , map and parse it (data will be: industry, mktcap, price, symbol)
  . get more data from financials ( eps, net income , shares, )
  . calculate p/e
  . push to db 

  public getProfileData(tempArray: Array<any>): Promise<any> {
    
    
    return tempArray;
  }

  /************************ GET COMPANY FINANCIAL DATA FROM DB + PARSING ***********************/
  public getCompany(companyName: string,period: string,listOfCategories: string[] ){
    //Check if length of listOfCategories is 0; If it is, we want ALL options
    if(listOfCategories.length === 0){
      listOfCategories = this.createList();
    }
    //Call to DB, pull RAW data and place into sorted array of Company Results
    this.analService.getSelectedData(listOfCategories,companyName,period)
    .pipe(map(
            //Define the array of Data we will be receiving from DB 
              (dataArray: { category: string,
                            id: number,
                            period: string,
                            statement: string,
                            symbol_date_value: string}[]
              ) => {
          
          let tempCompany: Company; // Holds the financial records for a specific year.
          let flag: boolean = false; //Check to see if company found
          
          //loop through each dataArray element
          //Goals, to map each category to their corresponding year
          dataArray.forEach(element => {

            //Parse the values -Array- so we can evaluate a potential match: COMPANY NAME, DATE, YEAR, VALUE
             let values = element.symbol_date_value.split(",");

            //Check to see if there is already data in company
            if (this.company.results.length != 0){   
              //Check if similar year exists
              this.company.results.forEach(companyYear => {
                if(companyYear.year == +values[2]){
                  //update map value and key of this company; revenue, 200
                  companyYear.data.set(element.category,+values[3]);
                  //mark true that we found an existing year and no need to create a new company
                  flag = true;
                  return;
                  }  //if years match
                }) // loop, master list
              } // if master list != 0 
              
            // Assuming either the array length is zero or,
            // We did not find a matching year so therefore, we need to create a new company with a new year
              if(flag == false){
                //Initialise New Company to push into Master List
                tempCompany = new Company();
                tempCompany.data = new Map();
                tempCompany.name = values[0];
                tempCompany.year = +values[2];
                tempCompany.quarter = 0;
                tempCompany.data.set(element.category,+values[3]);
                //Push new Company or updated company into List
                this.company.results.push(tempCompany)
                this.company.name = values[0];
                this.company.period = element.period;
              } else {  //If flag is true, means we found a company and can skip to the next element
                //Reset flag to false assuming company not found, until found
                flag = false;
              }
          }); // Loop through array of Company info from DB
          this.company.id = this.idCounter;
    }))
    .pipe(map( () => {
      //Reorder the companies descending from latest year
      let tempCompanyResults = new Company();
      for(let i = 1; i < this.company.results.length; i++){
        for(let k = 0; k < i; k++){
          //If the outerloop company is > swap
          if(this.company.results[i].year > this.company.results[k].year){
            tempCompanyResults = this.company.results[i];
            this.company.results[i] = this.company.results[k];
            this.company.results[k] = tempCompanyResults;
          }
        }
      }
    }))
    .subscribe(

                res => {this.companyMasterList.push(this.company),
                        this.ammendReferenceCompanyMasterList(this.company.name),
                        this.msgService.sendToast("Successfully added " + this.company.name,"Search Criteria", 1)
                      },

                err => {this.msgService.addError("Error getting search results: "),
                        this.msgService.addError(err)},
                        
                ()  => { 
                         this.company = new CompanyResults(), 
                         this.idCounter++, 
                         this.refreshMasterList()
                        }
    ) 
  }

  //Returns all options of Categories for Search Criteria component
  private createList(): string[] {
    let tempList: string[] = [];
    this.tableIncome.forEach(category => {
      tempList.push(category)
    });
    this.tableCash.forEach(category => {
      tempList.push(category)
    });
    this.tableBalance.forEach(category => {
      tempList.push(category)
    });
    return tempList;
  }

/****************************** 
  MANAGE companyMasterList 
  ******************************/
  
  //Deletes a Company from the Master List based on ID, then refreshes list
  public deleteFromMasterList(id: number){
      this.companyMasterList.forEach( (company, index) => {
          if(id === company.id){
              this.companyMasterList.splice(index,1);
              this.refreshMasterList();
              return;
          }
      })      
  }

    //Whatever Components are subscribed to the  sharedMasterList :Subject will be refreshed
  public  refreshMasterList(){
      this.sharedMasterList.next(this.companyMasterList)
    }
  
  public getMasterList(): CompanyResults[]{
      return this.companyMasterList;
  }

  //Saves the user selected MasterList from the display advanced component
  public saveUserSelectedList(list: CompanyResults[]){
    this.sharedUserSelectedMasterList = list;
  }

  public getUserSelectedList(): CompanyResults[] {
    return this.sharedUserSelectedMasterList;
  }

  /*******************************************************
   * REFERENCE TO COMPANYMASTERLIST - list of companies we have stored already
   *****************************************/
  public ammendReferenceCompanyMasterList(name: string) {
    this.referenceCompanyMasterList.push(name);
  }

  public deleteReferenceCompanyMasterList(name: string){
    for(let i = 0; i < this.referenceCompanyMasterList.length; i++){
        if(name === this.referenceCompanyMasterList[i]){
          this.referenceCompanyMasterList.splice(i,1);
        }
    }
  }

  public checkRefernceIfCompanyExists(name: string): boolean {
    let flag: boolean = false;
    for(let i = 0; i < this.referenceCompanyMasterList.length; i++){
      if(name === this.referenceCompanyMasterList[i]){
        flag = true;
        break;
      }
    }
    return flag;
  }

  /*/************************   DISPLAY COMPANY INFORMATION    *//************************/
  public getCategories(): Observable<{category: string,statement: string}> {
      return this.analService.getCategories()
                             .pipe(map( response => {
                                  return response[0];
                             }))
  }

  public getYears(): Observable<number[]> {
     return this.analService.getAllYears()
                          .pipe(map( response => {
                             let tempArray: number[] = [];
                            for(let i = 0; i < response[0].length; i++){
                              tempArray.push(+response[0][i].year)
                            }
                             return tempArray;
                          }));
  }

  /*RETURN A MAP OF TABLE CATEGORIES AND ITS CORRESPONDING STATEMENT */
  public getTableMap(): Map<string,string[]>{
    return this.tableMap;
  }
  
   /******************** OTHER FUNCTIONALITY********************/


 
}
