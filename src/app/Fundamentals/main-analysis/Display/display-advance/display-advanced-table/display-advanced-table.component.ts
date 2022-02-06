import { Component, OnInit, Input, EventEmitter} from '@angular/core';
import {CompanyResults, Company} from '../../../../../../Models/Analyser/Company'

@Component({
  selector: 'app-display-advanced-table',
  templateUrl: './display-advanced-table.component.html',
  styleUrls: ['./display-advanced-table.component.css']
})
export class DisplayAdvancedTableComponent implements OnInit {

  @Input() listOfCompanies: CompanyResults[] = []
  @Input() valueSelected: boolean = true;  //regarding $ or %
  @Input() categorySelected: string = "";
  @Input() categoriesSelected: string[] = [];

  @Input() displayedAs: boolean = true; //True for $ and false for %
  @Input() direction: boolean = true;// true for Descending

  @Input() yearList: number[] = [];
      yearMin: number;
      yearMax: number;
  
  // hide = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
    console.log("Inside")
    console.log(this.displayedAs)
  }

  // public hideTable(){
  //   this.hide.emit(true);
  // }

  //Checks to see if a Category exists
  // public isCategoryViewable(): boolean {
  //   let exists: boolean = false;
  //   try {
  //     this.categoriesSelected.forEach( category => {
  //       if (category === this.categorySelected) {
  //         throw "category"
  //       }
  //     })
  //   } catch (category) {
  //     if(category != "category") {
  //       throw category;
  //     }
  //     console.log("caught " + category)
  //     return true;
  //   }
  //   return exists;
  // }
  /***********************= FUNCTIONS TO DISPLAY DATA IN TABLES =***********************/

  /*RETURNS ALL THE YEARS STORED IN THE COMPANY */
  public getYears(): Array<number> {
    return this.yearList;
  }

  /*RETURNS ALL THE COMPANIES IN OUR LIST FOR DISPLAY */
  public displayCompanies(): string[] {
    let tempArray = new Array<string>();
    this.listOfCompanies.forEach(company => {
      tempArray.push(company.name);
    })
    return tempArray;
  }

  /* RETRIEVE DATA FOR DISPLAY BASED ON CATEGORY 
    LOCATE A MATCHING COMPANY NAME
     EXTRACT DATA PERTAINING TO CATEGORY */
  public fetchCategoryValue(companyName: string): number[] | void {
    let tempArray = new Array<number>();
    try{
           //Go through each company
          this.listOfCompanies.forEach( company => {

            //find the company we want to extract data from
            if ( company.name === companyName) {

              //Check to see what year this companies newest earnings are reported
             for(let i = 0; i < this.yearList.length; i++){

              //Check to see which year matches with the latest results
              if(this.yearList[i] == company.results[0].year) {
                 console.log("found matching year " + this.yearList[i]);
                 break;
               } else { tempArray.push(0)}
             }

              //Get each value based on desired category
              company.results.forEach(period => {     
                      tempArray.push(period.data.get(this.categorySelected));                
                  })

              // End the loop here, because we have the company we want
              throw "array"

            }  //If   
          })// forEach
    } catch (array) {
      if (array != 'array') throw array;
      //Check to see if we want to display Data in $ or %
      if(!this.displayedAs){
        tempArray = this.convertToPercent(tempArray);
      }
    }
      return tempArray;
  }

  //Converts from $ to %
  private convertToPercent(baseData: number[]): number[]{
    //assume we are in desending, so direciton is true
    let tempArray: number[] = [];

    if(this.direction){
      //Descending Order
      for(let i =  0;i < baseData.length - 1;i++){
        if(baseData[i] != 0 ){
          tempArray.push( (baseData[i] - baseData[i+1] ) / baseData[i + 1] * 100);
        }
      }
      //Last year doesn't have anything to compare to, so is null.
      tempArray.push(0);
    } else {
      //Ascending Order
      //Last year doesn't have anything to compare to, so is null.
      tempArray.push(0);
      for(let i =  0;i < baseData.length - 1;i++){
        if(baseData[i] != 0 ){
          tempArray.push( (baseData[i + 1] - baseData[i] ) / baseData[i] * 100);
        }
      }
      
    }
    
    return tempArray;
  }

  public execute(){
    this.listOfCompanies.splice(0)
  }
}
