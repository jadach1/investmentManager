import { Component, OnInit } from '@angular/core';

import {AnalysisService}        from '../../Services/Analyser/analysis.service'
import {MessageService}         from '../../Services/Messages/message.service'

import {Company}                from '../../../Models/Analyser/Company'



@Component({
  selector: 'app-main-analysis',
  templateUrl: './main-analysis.component.html',
  styleUrls: ['./main-analysis.component.css']
})



export class MainAnalysisComponent implements OnInit {
  companyNames: any; // List of companies
  categories: any; //List of Categories from DB
  searchModule: boolean = false; //Hides or Displays the checkbox selections
  displayModule: boolean = false; //Hide or Displays the results of the search
  listOfCategories: string[]; //Selected List of Categories from user
 
  //Display Variables & Objects
   companySelected = "?";
   periodSelected:  string = "";
   masterCompanyList: Company[] = [];

  constructor(private analService: AnalysisService,public messageService: MessageService) { }

  ngOnInit(): void {
    this.getCompanyNames();
    this.listOfCategories = new Array();
  }

  public getCompanyNames() {
    this.analService.getCompanyNames()
                    .subscribe(
                        res => this.companyNames = res[0],
                        err => this.messageService.addError("Couldn't get Company Names from Company"),
                        ()  => this.getCategories()
                    )
  }

  public getCategories() {
    this.analService.getCategories()
                    .subscribe(
                          res => this.categories = res[0],
                          err => this.messageService.addError("Couldn't get Company Categories")
                    )
  }

  //Sets the period selected
  public setPeriod(name: string){
    this.periodSelected = name;
  }

 
  // Checkbox is selected or Deselected
  public onChange(category: string,isChecked: boolean) {
    if (isChecked){
      this.listOfCategories.push(category)
    } else {
      const index = this.listOfCategories.indexOf(category);
      if (index > -1) {
         this.listOfCategories.splice(index, 1)
      }    
    }
  }

   //  DROPDOWN LIST: Sets the company selected 
  public onSelect(name: string){
      this.companySelected = name;
  }

  public clearCompany(){
      this.masterCompanyList = [];
      this.listOfCategories = new Array();
      this.periodSelected = "";
      this.companySelected = "?";
  }

  /***************************************************************************\
      These 4 functions will fetch the Data of a company depending on Search Criteria
  \****************************************************************************/
  public checkLength(){
    //Make sure a company and period are selected
    if(this.companySelected != "?" && this.periodSelected != ""){
      //If length is zero than assume we want all options, 
      //so we will upload all options to the listOfCategories
      if(this.listOfCategories.length == 0) {
        this.convertList().then(  res =>  this.fetchData() )
      } else { this.fetchData() } 
    } else {
      this.messageService.addError("Error, You need to Select a company and period in order for this to work")
    }
  }

  //Convert all members of array categories into listOfCategories
  private async convertList() {
    this.categories.forEach(element => {
      this.listOfCategories.push(element.category)
    });
    return null;
  }

  //Service call to DB
  private fetchData(){
    this.analService
    .getSelectedData(this.listOfCategories,this.companySelected,this.periodSelected)
    .subscribe(
                res => this.parseFinancialData(res),
                err => {this.messageService.addError("Error getting search results: "),
                        this.messageService.addError(err)},
    ) 
  }

    //Seperate Financial from this
    /*
        category: revenue, 
        period: "year", 
        statement:"income-statement",
        symbol_date_value: "NFLX,12-31,2020,24996056000"
   
   Into this:
  
        company{
          name: MSFT
          year: 2019
          data: {
            revenue:     999,
            eps:         2.34,
            net income: 234
          }
        }
   */
  private parseFinancialData(dataArray: any) {
    let tempCompany: Company;
    let flag: boolean = false; //Check to see if company found
    
    //loop through each dataArray element
    dataArray.forEach(async element => {

    //Parse the values so we can evaluate a potential match: COMPANY NAME, DATE, YEAR, VALUE
     let values = element.symbol_date_value.split(",");

     if (this.masterCompanyList.length != 0){   
      //Check if similar year exists
      this.masterCompanyList.forEach(company => {
        if(company.year == values[2]){
          //update map value and key of this company
          company.data.set(element.category,values[3]);
          flag = true;
          return;
          }  //if years match
        }) // loop, master list
      } // if master list != 0 
      
    //If flag is true, means we found a company and can skip to the next element
      if(flag == false){
         //Initialise New Company to push into Master List
         tempCompany = new Company();
         tempCompany.data = new Map();
         tempCompany.name = values[0];
         tempCompany.year = values[2];
         tempCompany.quarter = 0;
         tempCompany.data.set(element.category,values[3]);
         //Push new Company or updated company into List
         this.masterCompanyList.push(tempCompany)
      } else {
        //Reset flag to false assuming company not found, until found
         flag = false;
      }
    }); // Loop through array of Company info from DB
  }


  /***************************************************************************\
      DISPLAY DATA 
  \****************************************************************************/
  public fetchCategoryValue(category: string): number[] {
    let values: number[] = [];
    this.masterCompanyList.forEach(company => {
      values.push(company.data.get(category));
     // console.log( "Getting " + category + " : " + company.data.get(category) + " for " + company.year) 
    })
    return values;
  }

  
  /***************************************************************************\
      SORTING DATA 
  \****************************************************************************/
  // Makes sure this list is sorted by Year - Ascending
  public sortMasterListAsc() {
    for(let i = 0; i < this.masterCompanyList.length; i++){
     for(let k = i + 1;k < this.masterCompanyList.length;k++){
        if(this.masterCompanyList[i].year > this.masterCompanyList[k].year){
            let tempCompany = new Company();
            tempCompany = this.masterCompanyList[i];
            this.masterCompanyList[i] = this.masterCompanyList[k];          
            this.masterCompanyList[k] = tempCompany;       
        }  // if
     } // for k     
    } // for i
  }

    // Makes sure this list is sorted by Year - Descending
    public sortMasterListDes() {
      for(let i = 0; i < this.masterCompanyList.length; i++){
       for(let k = i + 1;k < this.masterCompanyList.length;k++){
          if(this.masterCompanyList[i].year < this.masterCompanyList[k].year){
              let tempCompany = new Company();
              tempCompany = this.masterCompanyList[i];
              this.masterCompanyList[i] = this.masterCompanyList[k];          
              this.masterCompanyList[k] = tempCompany;       
          }  // if
       } // for k     
      } // for i
    }
    /***************************************************************************\
      TESTING
  \****************************************************************************/
 
  public getData() {  
    console.log(this.listOfCategories)
  }

  public showData(){
    console.log(this.masterCompanyList)
  }

  
}
