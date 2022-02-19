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

  @Input() displayIn: string; //Displayed in default, thousands or millions
  @Input() displayedAs: boolean = true; //True for $ and false for %
  @Input() direction: boolean = true;// true for Descending

  @Input() yearList: number[] = []; //This gets automatically sorted in the display-advacned component
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

  /*** RETURNS THE YEARS IN REFERENCE TO THE RANGE ***/
  public getYears(): Array<number> | void {
 
    if (this.direction){

        let difference = this.yearList.indexOf(this.yearRange.value);
        let newArray: number[] = new Array<number>(difference + 1);
  
        //Descending
        for(let i = 0; i <= difference; i++) {
          newArray[i] = this.yearList[i];
        }

        return newArray;

    } else {

        let difference = this.yearList.length - this.yearList.indexOf(this.yearRange.value);
        let newArray: number[] = new Array<number>(difference + 1);
  
        //ascending
        for(let i = 0; i < difference; i++) {
          newArray[i] = this.yearList[this.yearList.length - difference + i];
        }

        return newArray;
    }

  }

  /*** RETURNS ALL THE COMPANIES IN OUR LIST FOR DISPLAY ***/
  public displayCompanies(): string[] {
    let tempArray = new Array<string>();
    this.listOfCompanies.forEach(company => {
      tempArray.push(company.name);
    })
    return tempArray;
  }

  /***  1. RETRIEVE DATA FOR DISPLAY BASED ON CATEGORY 
        2. LOCATE A MATCHING COMPANY NAME
        3. EXTRACT DATA PERTAINING TO CATEGORY ***/
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
                } else { 
                  //If we are descending or ascending and below the yearRange value, push 0
                  if(this.yearList[i] >= this.yearRange.value && !this.direction || this.direction)
                          tempArray.push(0);
                    }
              } // for loop

                //Get each value based on desired category
                company.results.forEach(period => {     

                        //Ensure the year is greater than the minimum yearRange value
                        if( period.year >= this.yearRange.value ){

                          //Convert the value to thousands or millions. Exception is EPS, leave that alone
                          if(this.displayIn != "default"){
                            tempArray.push(this.changeDisplay(period.data.get(this.categorySelected)));
                          } else {
                            tempArray.push(period.data.get(this.categorySelected));
                          }

                        } else {
                          //Once the year we are seeking exceeds the yearRange we break the array
                          throw "out of range"
                        }             
                }) // forEach company.results

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
          default:
                break;
        }
    }
      return tempArray;
  }

  /*** Converts from $ to % ***/
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

      } //for loop

      //Last year doesn't have anything to compare to, so is null.
       tempArray.push(0);

    } else {

      //First year doesn't have anything to compare to, so is null.
       tempArray.push(0);

       //Ascending Order
      for(let i =  0;i < baseData.length - 1;i++){

        if(baseData[i] != 0 ){
          //Calculate % then round it to 2 decimal places
          let value: number = (baseData[i + 1] - baseData[i] ) / baseData[i] * 100;
          tempArray.push(+value.toFixed(2));
        } else {
          tempArray.push(0)
        }

      } // for lop
          console.log(tempArray)  
    }
    
    return tempArray;
  }

  private changeDisplay(value: number): number {
    let temp: number = 0;
    if(this.displayIn === "millions") {
      temp = value / 1000000;
    } else {
      temp = value / 1000;
    }
    //to 2 decimal places and convert to number
    return +temp.toFixed(2);
  }

  public execute(){
    this.listOfCompanies.splice(0)
  }

  /*** WE ONLY WANT TO DISPLAY ****/
  public isZero(value: number): boolean {
      return value === 0 ? true : false;
  }
}
