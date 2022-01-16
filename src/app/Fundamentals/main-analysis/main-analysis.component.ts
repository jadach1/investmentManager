import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {AnalysisService}        from '../../Services/Analyser/analysis.service'
import {AnalysisMidwayService}  from '../../Services/Analyser/analysis-midway.service'
import {MessageService}         from '../../Services/Messages/message.service'
import {Company, CompanyResults}                from '../../../Models/Analyser/Company'
import {MiscLibrary, ColourGenerator}            from '../../Misc/Functionality/miscLibrary'


@Component({
  selector: 'app-main-analysis',
  templateUrl: './main-analysis.component.html',
  styleUrls: ['./main-analysis.component.css']
})

export class MainAnalysisComponent implements OnInit, OnDestroy {

  //DISPLAY VARIABLES
   companyDisplayed: string;
   periodDisplayed: string;  
   companyFinancials: CompanyResults;
   masterCompanyList: CompanyResults[] = [];
   masterCompanySub: Subscription;

  constructor(private analService: AnalysisService,
              private analMidService: AnalysisMidwayService,
              public messageService: MessageService, 
              public miscLib: MiscLibrary,
              public colourGenerator: ColourGenerator) {}

  ngOnInit(): void {
    //Subscribe to MAsterList in Service and keep it updated
    this.masterCompanySub = this.analMidService.sharedMasterList.subscribe(
      list => this.masterCompanyList = list,
      err  => this.messageService.addError("Failed to get Master List")
    )
    console.log(this.masterCompanyList)
    this.messageService.sendToast("hello world","321",1);
    this.messageService.sendToast("hello world 2","321",2);
    this.messageService.sendToast("hello world 3","321",3);
    this.messageService.sendToast("hello world 4","321",4);
  }


  ngOnDestroy(): void {
      //Prevent Memory Leaks by Unsubscribing
      this.masterCompanySub.unsubscribe();
  }


  /***************************************************************************\
      DISPLAY DATA 
  \****************************************************************************/
  //Returns an array of numbers for each category of a companies selected year
  public fetchCategoryValue(category: string): number[] {
    let values: number[] = [];
    this.companyFinancials.results.forEach(company => {
      values.push(company.data.get(category));
    })
    return values;
  }

  //Take a name of a company and returns a colour corresponding to the first letter
  public getColour(str: string):String {
    return this.colourGenerator.generateByLetter(str);
  }

  //Deletes a member from the MasterCompanyList
  public deleteMe(id: number) {
   console.log(id)
   this.analMidService.deleteFromMasterList(id)
  }

  //Selects a single company to be displayed
  public displayMe(company: CompanyResults) {
    this.companyDisplayed = company.name;
    this.periodDisplayed = company.period;
    this.companyFinancials = company;
  }

  //Retrieves the specific categories a specific company has
  public displayCategories(): string[]{
      let temp: string[] = [];
                                    //because categories are uniform across all years
      this.companyFinancials.results[0].data.forEach( (value,category) => {
        temp.push(category)
      })
      return temp;
  }
  
  /***************************************************************************\
      SORTING DATA 
  \****************************************************************************/
  // Makes sure this list is sorted by Year - Ascending
  public sortMasterListAsc() {
    for(let i = 0; i < this.companyFinancials.results.length; i++){
     for(let k = i + 1;k < this.companyFinancials.results.length;k++){
        if(this.companyFinancials.results[i].year > this.companyFinancials.results[k].year){
            let tempCompany = new Company();
            tempCompany = this.companyFinancials.results[i];
            this.companyFinancials.results[i] = this.companyFinancials.results[k];          
            this.companyFinancials.results[k] = tempCompany;       
        }  // if
     } // for k     
    } // for i
  }

  // Makes sure this list is sorted by Year - Descending
  public sortMasterListDes() {
    for(let i = 0; i < this.companyFinancials.results.length; i++){
      for(let k = i + 1;k < this.companyFinancials.results.length;k++){
          if(this.companyFinancials.results[i].year < this.companyFinancials.results[k].year){
              let tempCompany = new Company();
              tempCompany = this.companyFinancials.results[i];
              this.companyFinancials.results[i] = this.companyFinancials.results[k];          
              this.companyFinancials.results[k] = tempCompany;      
        }  // if
      } // for k     
    } // for i
  }
    /***************************************************************************\
      TESTING
  \****************************************************************************/


  public isListEmpty() : boolean {
    return this.masterCompanyList.length != 0 ? true : false;
  }
  
}
