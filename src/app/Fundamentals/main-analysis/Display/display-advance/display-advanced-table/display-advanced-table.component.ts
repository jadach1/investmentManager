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

  @Input() displayIn:     string;   //Displayed in default, thousands or millions
  @Input() displayedAs:   boolean   = true; //True for $ and false for %
  @Input() displayFormat: string;   //Precision or uniform
  @Input() direction:     boolean   = true;// true for Descending
  @Input() period:        boolean;  //Year t or Quarter f

  @Input() yearList:    number[] = []; //List of range of years
  @Input() displayList: string[] = [];//A sorted and formatted list of periods to be displayed
  @Input() yearRange: {
        minYear: number;
        maxYear: number;
        thumbnail: boolean;
        value: number;
  };

  constructor() { }

  ngOnInit(): void {
    console.log("display advanced table")
  }

  /***********************= FUNCTIONS TO DISPLAY DATA IN TABLES =***********************/

  public getPeriod(): Array<number|string> | void {
    console.log("get period")
    return this.displayList;
  }
  
  /*** RETURNS THE YEARS IN REFERENCE TO THE RANGE ***/
  public getYears(): Array<number|string> | void {
   //Descend?
    if (this.direction){
      //Descending
      let difference = this.yearList.indexOf(this.yearRange.value);
      let newArray  = new Array<number|string>(difference + 1);
      

      //Precise v Uniform
      if(this.displayFormat == "Precise"){

        //PRECISE
        for(let i = 0; i <= difference; i++) {
          newArray[i] = this.yearList[i];
        }

      } else {
        //UNIFORM

        //Descending so first occurence is latest
         newArray[0] = "Latest"

        for(let i = 1; i < difference; i++) {
          newArray[i] = ".";
        }

        //Descension into oldest
         newArray[difference] = "Oldest"
      }

      return newArray;

  } else {

     //ascending
      let difference = this.yearList.length - this.yearList.indexOf(this.yearRange.value);
      let newArray = new Array<number|string>(difference + 1);

      if(this.displayFormat=="Precise"){

        for(let i = 0; i < difference; i++) {
          newArray[i] = this.yearList[this.yearList.length - difference + i];
        }
  
      } else {
        //UNIFORM

        //Ascension, start from oldest
         newArray[0] = "Oldest";

        for(let i = 1; i < difference - 1; i++) {
          newArray[i] = ".";
        }

         newArray[difference - 1] = "Latest"

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

  /***  
   *    RESPONSIBLE FOR PUSHING A SINGLE COMPANIES VALUES - BASED ON CATEGORY - INTO AN ARRAY
   *    THE ARRAY THE WILL HOUSE ALL VALUES FOR THE CATEGORY DESIRED UP TO A SPECIFIC YEAR - BASED ON YEARRANGE.VALUE
   *    THE FUNCTION TAKES INTO ACCOUNT WHETHER OR NOT COMPANY-A HAS 2022 RESULTS VS COMPANY-B WHICH MAY ONLY HAVE RESULTS UP TO 2021
   *    THIS FUNCTION ALSO NEEDS TO TAKE INTO ACCOUNT WHETHER WE ARE DISPLAYING YEARLY OR QUARTELRY RESULTS
   * 
        1. RETRIEVE DATA FOR DISPLAY BASED ON CATEGORY   
        2. LOCATE A MATCHING COMPANY NAME
        3. EXTRACT DATA PERTAINING TO DESIRED CATEGORY 
        * yearList will affect the performance of quantity of Results
                                                                        ***/
  public fetchCategoryValue(companyName: string): number[] | void {
    let tempArray = new Array<number>();
    try{
      console.log("fetch")
           //1. Go through each company
          this.listOfCompanies.forEach( company => {
       
            //2. find the company we want to extract data from
            if ( company.name === companyName) {

              // //2.A. Only execute next seciton of code IF we want Precision relating to years
              if(this.displayFormat == "Precise"){

                  //Check to see what year this companies newest earnings are reported
                  for(let i = 0; i < this.displayList.length; i++){

                    //Check to see which year matches with the latest results
                      if(+this.displayList[i] == company.results[0].year) { 
                      //  console.log("found matching year " + this.yearList[i]);
                      break;
                    } else { 
                      //If we are descending or ascending and below the yearRange value, push 0
                      if(+this.displayList[i] >= this.yearRange.value && !this.direction || this.direction)
                      {
                        tempArray.push(0); 
                      }     
                        }
                  } // for loop

               } //If
            
                //3. Get each value based on desired category
                company.results.forEach(compResults => {     
   
                        if( compResults.year >= this.yearRange.value ){
                          
                          //Convert the value to thousands or millions. Exception is EPS, leave that alone
                          if(this.displayIn != "default"){
                            tempArray.push(this.changeDisplay(compResults.data.get(this.categorySelected)));
                          } else {
                            tempArray.push(compResults.data.get(this.categorySelected));
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

      //4. Check if we want displayed as % or $
        switch (array) {

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

    //Check the direction we will be providing results
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

 
}
