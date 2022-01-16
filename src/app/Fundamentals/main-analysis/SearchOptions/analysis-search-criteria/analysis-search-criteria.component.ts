import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import {AnalysisService}              from '../../../../Services/Analyser/analysis.service'
import {AnalysisMidwayService}        from '../../../../Services/Analyser/analysis-midway.service'
import {MessageService}               from '../../../../Services/Messages/message.service'
import {Company, CompanyResults}      from '../../../../../Models/Analyser/Company'
import {MiscLibrary, ColourGenerator} from '../../../../Misc/Functionality/miscLibrary'

@Component({
  selector: 'app-analysis-search-criteria',
  templateUrl: './analysis-search-criteria.component.html',
  styleUrls: ['./analysis-search-criteria.component.css']
})

export class AnalysisSearchCriteriaComponent implements OnInit {

companyNames: string[];  // List of companies
tableMap: Map<string,string[]>; //List of Categories and their correspoding statements

//These variables hold what the user has selected from the Form
selectedCompany = "";
periodSelected = "";
listOfCategories: string[] = [];

 constructor(private analService: AnalysisService,
  private analMidService: AnalysisMidwayService,
  public messageService: MessageService, 
  public miscLib: MiscLibrary,
  public colourGenerator: ColourGenerator) {}

 ngOnInit(): void {
    //Get List of Company names in the DB
    this.analService.getCompanyNames()
                    .pipe(map( companyNames => {
                          let tempArray = new Array<string>();
                          companyNames[0].forEach(element => {
                              tempArray.push(element.company)
                          });
                          return tempArray;
                    }))
                    .subscribe(
                          listOfCompanies => this.companyNames = listOfCompanies,
                          err => this.messageService.addError("Failure for task: getCompanyNames")
                    )

    //Get Map of Categories with corresponding Statements for checkboxes
    this.tableMap = this.analMidService.getTableMap();
 }

  /* GETTERS */
 public getCategories(statement: string): string[] {
   return this.tableMap.get(statement)
 }

 /* SETTERS */
 public setCompany(company: string) {
   this.selectedCompany = company;
 }

 public setPeriod(period: string) {
   this.periodSelected = period;
 }

 /* EVENTS */

 public onChange(category: string, check: boolean){
    if(check === true){
      this.listOfCategories.push(category)
    } else {
      this.listOfCategories.splice(this.listOfCategories.indexOf(category),1)
    }
 }

 public onSubmit() {
   if(this.selectedCompany != "" && this.periodSelected != "") {
    this.analMidService.getCompany(this.selectedCompany, this.periodSelected, this.listOfCategories)
   } else {
    this.messageService.addError("You must select a valid Company and Period in order to get a Result")
   }
 }

 /* FUNCTIONAL METHODS */

 //Reset Form
 public clear(){
   this.selectedCompany = "";
   this.periodSelected = "";
   this.listOfCategories = [];
 }

 //Tester
 public tester(){
   console.log(this.listOfCategories)
 }
}
