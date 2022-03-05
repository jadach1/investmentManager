import { Component, OnInit, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import {CompanyResults, Company} from '../../../../../Models/Analyser/Company'
import {AnalysisMidwayService} from '../../../../Services/Analyser/analysis-midway.service'
import {AnalysisService} from '../../../../Services/Analyser/analysis.service'
import {MessageService} from '../../../../Services/Messages/message.service'
import {ColourGeneratorService} from '../../../../Services/Misc/colour-generator.service'

//Used to display a range of years for the user, cooperates with yearList
interface yearSlider{
  minYear: number;
  maxYear: number;
  thumbnail: boolean;
  value: number;
}

@Component({
  selector: 'app-display-advance',
  templateUrl: './display-advance.component.html',
  styleUrls: ['./display-advance.component.css']
})
export class DisplayAdvanceComponent implements OnInit, OnDestroy {

companyMasterList: CompanyResults[] = [];
userSelectedList: CompanyResults[] = [];
categoryMasterList: string[] = [];
categoriesSelected: string[] = [];

direction: boolean    = true //For either in Descending or Ascending order, true = descending
viewAs: boolean       = true; //For displaying either in $ or %
displayIn: string     = "default"; //For displaying in its default form or in thousands or millions.
displayFormat: string = "Precise"; //Display based on the year of statement or just in uniformity

yearList:  number[]   = [];  // Used to display all the years available in DB for company financials
yearRange: yearSlider;

  constructor(private analMidServe: AnalysisMidwayService,
              private analService: AnalysisService,
              private msgServe: MessageService,
              public colourGen: ColourGeneratorService) { }

  ngOnInit(): void {

    this.companyMasterList = this.analMidServe.getMasterList();
    //If we exit out of this compoenent it will delete the userSelectedList, so this is a failsafe to retrieve it
    this.userSelectedList = this.analMidServe.getUserSelectedList();

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
                                err => this.msgServe.sendToast("Failure to get years","year down",2),
                                ()  => this.createYearRange()
                                )
  }

  ngOnDestroy(): void {
       //we need to save the userSelectedList or all companies will be lost
      this.analMidServe.saveUserSelectedList(this.userSelectedList);
  }


  /***************************************************************************\
      COMPANY MASTER LIST MANIPULATION
  \****************************************************************************/

  /* Iterate through all members of the userSelectedList to see if company we are addomg already exists */
  public addCompany(company: CompanyResults) {
    //If nothing is in the list we can just amend
    if(this.userSelectedList.length === 0 ){
      this.addCompanyPlus(company)
    } else {

      // Check to make sure company doesn't already belong to array
      try{

        this.userSelectedList.forEach(userCmp => {
 
          //If we find company exists, throw ourselves out of array and prevent from ammending
          if(userCmp.id === company.id) {
              throw "exists"
          }
          
        }) //for each

        //Company doesn't exist and can be added
        this.addCompanyPlus(company)

      } catch (company) {
        if (company != "exists") throw company;
        this.msgServe.sendToast("Company Already Exists", "Add Company",4);
      }
        
    }
  }

  //Adds a company to userSelectedList & Removes a company from MasterList
  private addCompanyPlus(company: CompanyResults){
    this.userSelectedList.push(company);
    this.companyMasterList.splice(this.companyMasterList.indexOf(company),1);
    this.msgServe.sendToast("Added " + company.name, "Add Company",1);
  }

  /*Add all companies to userSelectedList and Remove from MasterList*/
  public addAllCompanies() {
      this.companyMasterList.forEach( company => {
       this.userSelectedList.push(company);    
    })
    this.companyMasterList.splice(0);
    this.msgServe.sendToast("Added All Companies","Add Company",1);
  }

  public dropCompanyMasterList(id: number){
    for(let i = 0; i < this.companyMasterList.length; i++){
      if(this.companyMasterList[i].id === id) {
        this.analMidServe.deleteReferenceCompanyMasterList(this.companyMasterList[i].name)
        this.msgServe.sendToast("Removed " + this.companyMasterList[i].name,"Remove Company",2);
        this.companyMasterList.splice(this.companyMasterList.indexOf(this.companyMasterList[i]),1);
        break;
      }
    }
}

  /***************************************************************************\
      COMPANY USER LIST MANIPULATION
  \****************************************************************************/

  public dropCompany(id: number){
      for(let i = 0; i < this.userSelectedList.length; i++){
        if(this.userSelectedList[i].id === id) {
          this.companyMasterList.push(this.userSelectedList[i]);
          this.msgServe.sendToast("Removed " + this.userSelectedList[i].name,"Remove Company",2);
          this.userSelectedList.splice(this.userSelectedList.indexOf(this.userSelectedList[i]),1);
          break;
        }
      }
  }

  //Drops all companies from UserSelectedList and places them in MasterList
  public dropAllCompanies() {
    this.userSelectedList.forEach( company => {
        this.companyMasterList.push(company);
      })
      this.userSelectedList.splice(0);
      this.msgServe.sendToast("Removed All Companies" ,"Remove Companies",3);
  }

  /***************************************************************************\
      CATEGORIES LIST MANIPULATION 
  \****************************************************************************/
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

  //Sets the direction so we know hwo to calculate the sums of % increases
  public setDirection() {
    this.direction = !this.direction;
    this.sortMasterList();
  }

  // Makes sure this list is sorted by Year - Ascending or Descending
  public sortMasterList() {
    //Flips the companies around in reverse
    this.userSelectedList.forEach( company => {
      let tempCompany = new Array<Company>();
      for(let i = 0;i < company.results.length;i++){
        tempCompany.push(company.results[company.results.length - 1 - i]); // copy from the back end of the array
      }
      company.results = tempCompany;
    })

    //Flip years around in new array tempYears
    let tempYears: number[] = [];
    for(let i = 0;i < this.yearList.length;i++){
      tempYears.push(this.yearList[this.yearList.length - 1 - i]); //Copy for the tail end of the array 
    }
    this.yearList = tempYears; // Reset the yearList array
  }


  /***************************************************************************\
      MISC FUNCTIONS
  \****************************************************************************/

  //For displaying either in $ or %
  public displayAs(flag: boolean) {
    this.viewAs = flag;
  }

  /*CHANGES HOW WE DISPLAY A NUMBER, IN ITS NATURAL STATE, IN MILLIONS OR THOUSANDS */
  public toBeDisplayedIn() {
    switch (this.displayIn) {
      case "default":
          this.displayIn = "millions";
          break;
      case "millions":
        this.displayIn = "thousands";
        break; 
      default:
        this.displayIn = "default";
        break; 
    }
  }

   /*CHANGES HOW WE DISPLAY RESULTS*/
   public formatDisplay() {
    this.displayFormat === "Precise" ? this.displayFormat = "Uniform" : this.displayFormat = "Precise";
  }

  public getColour(str: string): String {
    return this.colourGen.generateByLetter(str);
  }

  public userSelected(): boolean {
    return this.userSelectedList.length > 0 ? true: false;
  }

  /*Initialise the YearRange Object*/
  private createYearRange() {
    if(this.yearList.length > 0){
        this.yearRange = {
          minYear:   this.yearList[this.yearList.length - 1],
          maxYear:   this.yearList[0],
          thumbnail: true,
          value:     this.yearList[this.yearList.length - 1]
        }
    }
  }

}
