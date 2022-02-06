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
direction: boolean = true //For either in Descending or Ascending order, true = descending
viewAs: boolean = true; //For displaying either in $ or %
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

  /********* ADDING OR REMOVING COMPANIES FROM LIST **********/

  //Iterate through all members of the userSelectedList to see if company we are addomg already exists
  public addCompany(company: CompanyResults) {

    if(this.userSelectedList.length === 0 ){
      this.userSelectedList.push(company)
    } else {

      // Check to make sure company doesn't already belong to array
      try{
        this.userSelectedList.forEach(userCmp => {
          if(userCmp.id === company.id) {
              throw "exists"
          }
        })
      } catch (company) {
        if (company != "exists") throw company;
        this.msgServe.sendToast("Company Already Exists", "Add Company",4);
      }
      
      //Company doesn't exist and can be added
        this.userSelectedList.push(company);
        this.companyMasterList.splice(this.companyMasterList.indexOf(company),1);
        this.msgServe.sendToast("Added " + company.name, "Add Company",1);
   
    }
  }

  //Add all companies to userSelectedList and Remove from MasterList
  public addAllCompanies() {
      this.companyMasterList.forEach( company => {
       this.userSelectedList.push(company);    
    })
    this.companyMasterList.splice(0);
    this.msgServe.sendToast("Added All Companies","Add Company",1);
  }


  public dropCompany(id: number){
    this.companyMasterList.forEach( company => {
      if(company.id === id) {
        this.userSelectedList.splice(this.userSelectedList.indexOf(company),1);
        this.msgServe.sendToast("Removed " + company.name,"Remove Company",2);
      }
    })
  }

  //Drops all companies from UserSelectedList and places them in MasterList
  public dropAllCompanies() {
    this.userSelectedList.forEach( company => {
        this.companyMasterList.push(company);
      })
      this.userSelectedList.splice(0);
      this.msgServe.sendToast("Removed All Companies" ,"Remove Companies",3);
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
  public sortMasterList() {
    // this.userSelectedList.forEach( company => {
    //   for(let i = 0; i < company.results.length; i++){
    //     for(let k = i + 1; k < company.results.length; k++){
    //       if(company.results[i].year > company.results[k].year){
    //         let tempCompany    = new Company();
    //         tempCompany        = company.results[i];
    //         company.results[i] = company.results[k];
    //         company.results[k] = tempCompany;
    //       }
    //     }
    //   }
    // })
    this.userSelectedList.forEach( company => {
      let tempCompany = new Array<Company>();
      for(let i = 0;i < company.results.length;i++){
        tempCompany.push(company.results[company.results.length - 1 - i]); // copy from the back end of the array
      }
      company.results = tempCompany;
      console.log(company.results)
    })

    //Flip years around in new array tempYears
    let tempYears: number[] = [];
    for(let i = 0;i < this.yearList.length;i++){
      tempYears.push(this.yearList[this.yearList.length - 1 - i]); //Copy for the tail end of the array 
    }
    this.yearList = tempYears; // Reset the yearList array
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

  /***************************************************************************\
      MISC FUNCTIONS
  \****************************************************************************/

  public displayAs(flag: boolean) {
    this.viewAs = flag;
  }

  public setDirection(flag: boolean) {
    this.direction = flag;
    this.sortMasterList();
    // flag ? this.sortMasterListDesc():this.sortMasterListAsc();
  }
}
