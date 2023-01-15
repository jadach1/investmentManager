import { Component, OnInit, OnDestroy } from '@angular/core';
import { map }                          from 'rxjs/operators';
import {CompanyResults, Company}        from '../../../../../Models/Analyser/Company'
import {AnalysisMidwayService}          from '../../../../Services/Analyser/analysis-midway.service'
import {MessageService}                 from '../../../../Services/Messages/message.service'
import {ColourGeneratorService}         from '../../../../Services/Misc/colour-generator.service'

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
userSelectedList:  CompanyResults[] = [];
categoryMasterList: string[] = [];
categoriesSelected: string[] = [];

period: boolean       = true; // True is for Annual as False is for Quarterly

  constructor(private analMidServe: AnalysisMidwayService,
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
                        () => console.log("display advanced subscribed")
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
      
       company.period === "quarter" ? this.period = false : this.period = true; 
       this.addCompanyPlus(company)

    // THE LIST IS NOT EMPTY, Parse for duplicates or period issues
     } else {

      // Check to make sure company doesn't already belong to array
      try{

        //Check: NOT MIXING QUARTERLY AND YEARLY RESUTLS
        if( this.period === true && company.period === "quarter" || this.period === false && company.period === "year" )
            throw "crossover"
        
        // Loop through each Company we have alread saved
         this.userSelectedList.forEach(userCmp => {
 
           //If we find company exists, throw ourselves out of array and prevent from ammending
            if(userCmp.id === company.id) 
              throw "exists"

        }) //for each

        //Company doesn't exist and can be added
         this.addCompanyPlus(company)

      } catch (company) {

          console.log("in addCompany::display-Advanced " + company)
          
          switch (company) {

            case 'exists': 
              this.msgServe.sendToast("Company Already Exists", "Add Company",4);
              break;

            case 'crossover':
              this.msgServe.sendToast("Cannot Mix Yearly and Quarterly Results","Add Company" ,4);
              break;

          } 
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
        //Important: we save names into the ReferenceCompanyMasterList with their ammended period: Year v Quarter
        let newName = this.companyMasterList[i].name + this.companyMasterList[i].period
        this.analMidServe.deleteReferenceCompanyMasterList(newName)
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
      MISC FUNCTIONS
  \****************************************************************************/

  public getColour(str: string): String {
    return this.colourGen.generateByLetter(str);
  }

  //Used to check if we are ready to display the tables or not
  public userSelected(): boolean {
    if(this.userSelectedList.length > 0 && this.categoriesSelected.length > 0)
      return true;
    else
      return false;
  }
 
    
}
