import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import {CompanyResults, Company} from '../../../../../Models/Analyser/Company'
import {AnalysisMidwayService} from '../../../../Services/Analyser/analysis-midway.service'
import {AnalysisService} from '../../../../Services/Analyser/analysis.service'
import {MessageService} from '../../../../Services/Messages/message.service'
import {ColourGeneratorService} from '../../../../Services/Misc/colour-generator.service'

@Component({
  selector: 'app-display-advance',
  templateUrl: './display-advance.component.html',
  styleUrls: ['./display-advance.component.css']
})
export class DisplayAdvanceComponent implements OnInit {

companyMasterList: CompanyResults[] = [];
userSelectedList: CompanyResults[] = [];
categoryMasterList: string[] = [];
categoriesSelected: string[] = [];
yearList: number[] = [];  // Used to display all the years available in DB for company financials


  constructor(private analMidServe: AnalysisMidwayService,
              private analService: AnalysisService,
              private msgServe: MessageService,
              public colourGen: ColourGeneratorService) { }

  ngOnInit(): void {
    this.companyMasterList = this.analMidServe.getMasterList();
    this.analMidServe.getCategories()
                      .pipe( map( (categories: Object) => {
                        let temp: string[] = new Array();
                        for( const [ke, value] of Object.entries(categories)) {
                            temp.push(value.category);
                        }
                        return temp;
                      }))
                     .subscribe(
                       CAT => {this.categoryMasterList = CAT},
                       err => this.msgServe.sendToast("Error Getting Categories","Display Advanced ", 2),
                     )
     this.analMidServe.getYears()
                      .subscribe( 
                                res => this.yearList = res, 
                                err => this.msgServe.sendToast("Failure to get years","year down",2)
                                )
  }

  public getColour(str: string): String {
      return this.colourGen.generateByLetter(str);
  }

  public userSelected(): boolean {
    return this.userSelectedList.length > 0 ? true: false;
  }

  public viewIt() {
    console.log(this.companyMasterList)
    console.log(this.userSelectedList)
  }

  /* ADDING OR REMOVING COMPANIES FROM LIST */

  //Iterate through all members of the userSelectedList to see if company we are addomg already exists
  public addCompany(company: CompanyResults) {
    if(this.userSelectedList.length === 0 ){
      this.userSelectedList.push(company)
    } else {
      // Check to make sure company doesn't already belong to array
      let flag: Boolean = false;

      this.userSelectedList.forEach(userCmp => {
        if(userCmp.id === company.id) {
            flag = true;
        }
      })
      if(flag === false) {
        this.userSelectedList.push(company)
        this.msgServe.sendToast("Added " + company.name, "Add Company",1);
      } else {
        this.msgServe.sendToast("Company " + company.name + " Already Exists", "Add Company",4);
      }
    }
  }

  public dropCompany(id: number){
    this.companyMasterList.forEach( company => {
      if(company.id === id) {
        this.userSelectedList.splice(this.userSelectedList.indexOf(company),1);
        this.msgServe.sendToast("Removed " + company.name,"Remove Company",2);
      }
    })
  }

  /********* CATEGORY LIST *********/
  public addCategory(category: string) {
    this.categoriesSelected.push(category)
    this.msgServe.sendToast("Successfully Added New Category to View: " + category,"Category Add",1)
    this.categoryMasterList.splice(this.categoryMasterList.indexOf(category),1)
  }

  public dropCategory(category: string){
    this.categoriesSelected.splice(this.categoriesSelected.indexOf(category),1);
    this.msgServe.sendToast("Successfully Droped Category from View " + category, "Category Drop",1);
    this.categoryMasterList.push(category)
  }

  public selectAllCategories() {
    if(this.categoryMasterList.length > 0){
          this.categoryMasterList.forEach(category => {
      this.categoriesSelected.push(category);
    })
    this.msgServe.sendToast("Added All Categories","Categories",3);
    this.categoryMasterList.splice(0)
    } else {
      this.msgServe.sendToast("Nothing to Add","Remove Categories",4)
    }

  }

  public removeAllCategories() {
    if(this.categoriesSelected.length > 0) {
       this.categoriesSelected.forEach(category => {
      this.categoryMasterList.push(category)
    })
    this.msgServe.sendToast("Removed All Categories","Remove Categories",3);
    this.categoriesSelected.splice(0)
    } else {
      this.msgServe.sendToast("Nothing to Remove","Remove Categories",4)
    }
   
  }

      /***************************************************************************\
      SORTING DATA 
  \****************************************************************************/
  // Makes sure this list is sorted by Year - Ascending
  public sortMasterListAsc() {
    this.userSelectedList.forEach( company => {
      for(let i = 0; i < company.results.length; i++){
        for(let k = i + 1; k < company.results.length; k++){
          if(company.results[i].year > company.results[k].year){
            let tempCompany    = new Company();
            tempCompany        = company.results[i];
            company.results[i] = company.results[k];
            company.results[k] = tempCompany;
          }
        }
      }
    })
  }

  public sortMasterListDesc() {
    this.userSelectedList.forEach( company => {
      for(let i = 0; i < company.results.length; i++){
        for(let k = i + 1; k < company.results.length; k++){
          if(company.results[i].year < company.results[k].year){
            let tempCompany    = new Company();
            tempCompany        = company.results[i];
            company.results[i] = company.results[k];
            company.results[k] = tempCompany;
          }
        }
      }
    })
  }
}
