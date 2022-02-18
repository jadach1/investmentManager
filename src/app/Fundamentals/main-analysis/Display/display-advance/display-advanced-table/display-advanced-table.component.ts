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
  @Input() yearRange: {
        minYear: number;
        maxYear: number;
        thumbnail: boolean;
        value: number;
  };

  constructor() { }

  ngOnInit(): void {

  }

  /***********************= FUNCTIONS TO DISPLAY DATA IN TABLES =***********************/

  /*RETURNS THE YEARS IN REFERENCE TO THE RANGE */
  public getYears(): Array<number> {
    let newArray: number[] = [];
    this.yearList.forEach(year => {
      if(year >= this.yearRange.value){
          newArray.push(year);
      }
    })

    return newArray;
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
                //  console.log("found matching year " + this.yearList[i]);
                 break;
               } else { tempArray.push(0)}
             }
              //Get each value based on desired category
              company.results.forEach(period => {     
                      if( period.year >= this.yearRange.value ){
                        tempArray.push(period.data.get(this.categorySelected));  
                      } else {
                        throw "out of range"
                      }             
                  })

              // End the loop here, because we have the company we want
              throw "array"

            }  //If   
          })// forEach
    } catch (array) {
        switch (array) {
          //Check if we want displayed as %
          case "array":
            if(!this.displayedAs) {
              tempArray = this.convertToPercent(tempArray);
            }
            break;
          case "out of range":
            console.log("exit, out of range date")
            break;
          default:
            break;

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
        //If the value is 0 most likely, the numbers for that particular year haven't beem acquired, forward the 0
        if(baseData[i] != 0 ){
          let value: number = (baseData[i] - baseData[i+1] ) / baseData[i + 1] * 100;
          tempArray.push(+value.toFixed(2));
        } else {
          tempArray.push(0)
        }
      }
      //Last year doesn't have anything to compare to, so is null.
      tempArray.push(0);
    } else {
      //Ascending Order
      //First year doesn't have anything to compare to, so is null.
      tempArray.push(0);
      for(let i =  0;i < baseData.length - 1;i++){
        if(baseData[i] != 0 ){
          //Calculate % then round it to 2 decimal places
          let value: number = (baseData[i + 1] - baseData[i] ) / baseData[i] * 100;
          console.log(+value.toFixed(2))
          tempArray.push(+value.toFixed(2));
        }
      }
      console.log("descending")
      console.log(tempArray)
      
    }
    
    return tempArray;
  }

  public execute(){
    this.listOfCompanies.splice(0)
  }
}
