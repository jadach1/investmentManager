/***********************************************************
                    IMPORTS
**********************************************************/

import { Component, Input, OnInit } from '@angular/core';
import { Company, CompanyResults }  from 'src/Models/Analyser/Company';

// Services
import {AnalysisMidwayService}      from '../../../../../Services/Analyser/analysis-midway.service'
import {MessageService}             from '../../../../../Services/Messages/message.service'
import {ColourGeneratorService}     from '../../../../../Services/Misc/colour-generator.service'

/***********************************************************
                    COMPONENT DECLARATION
**********************************************************/
@Component({
  selector: 'app-display-advanced-create',
  templateUrl: './display-advanced-create.component.html',
  styleUrls: ['./display-advanced-create.component.css']
})

/***********************************************************
                    CLASS
**********************************************************/
export class DisplayAdvancedCreateComponent implements OnInit {

  @Input() listOfCompanies:    CompanyResults[] = []
  @Input() categorySelected:   string           = "";
  @Input() categoriesSelected: string[]         = [];
  @Input() period:             boolean;  //Year t or Quarter f

  valueSelected: boolean = true;   //regarding $ or %
  displayIn:     string;           //Displayed in default, thousands or millions
  format:        boolean   = true; //True for $ and false for %
  direction:     boolean   = true; // true for Descending
  

  yearListVanilla:    string[] = []; //List of range of years
  yearListBeta:       string[] = [];// Transformed list of years
  yearListFinal:      string[] = [];// Final list, with quarterly results
  yearRange: {
        minYear:    number;
        maxYear:    number;
        thumbnail:  boolean;
        desiredMin: number;
        desiredMax: number;
        currentMin: number;
        currentMax: number;
  };

  constructor(private analMidServe: AnalysisMidwayService, 
              private msgServe: MessageService,
              private colourGen: ColourGeneratorService) { 
                 //Create List of Years
     this.analMidServe.getYears()
     .subscribe( 
               res => this.yearListVanilla = res, 
               err => this.msgServe.sendToast("Failure to get years","year down",2),
               ()  => this.createYearRange()
                      //copy list, then format if necessary
                      .then( res =>  this.yearListBeta = [...this.yearListVanilla] )
                      .then( res => {
                        if( !this.period )
                            this.formatDisplayList();
                      }).catch( err => console.log(err))
               )
              }

  ngOnInit(): void {

    
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
    // //Flips the companies around in reverse
    // this.userSelectedList.forEach( company => {
    //   let tempCompany = new Array<Company>();
    //   for(let i = 0;i < company.results.length;i++){
    //     tempCompany.push(company.results[company.results.length - 1 - i]); // copy from the back end of the array
    //   }
    //   company.results = tempCompany;
    // })

    //Flip years around in new array tempYears
    let tempYears: string[] = [];
    for(let i = 0;i < this.yearListBeta.length;i++){
      tempYears.push(this.yearListBeta[this.yearListBeta.length - 1 - i]); //Copy for the tail end of the array 
    }

    this.yearListBeta = tempYears; // Reset the yearListVanilla array

    //Flip years around for yearListVanilla
     tempYears = this.yearListVanilla.reverse();
     this.yearListVanilla = tempYears;

    if(!this.period)
      this.formatDisplayList()
  }
  
  /***************************************************************************\
      MISC FUNCTIONS
  \****************************************************************************/

  //For displaying either in $ or %
  public displayAs(flag: boolean) {
    this.format = flag;
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

  public getColour(str: string): String {
    return this.colourGen.generateByLetter(str);
  }

  /***************************************************************************\
      YEAR LIST FUNCTIONS
  \****************************************************************************/

  /*Initialise the YearRange Object*/
  private createYearRange(): Promise<any> {
    console.log(this.yearListVanilla)
    if(this.yearListVanilla.length > 0){
        this.yearRange = {
          minYear:     +this.yearListVanilla[this.yearListVanilla.length - 1],
          maxYear:     +this.yearListVanilla[0],
          thumbnail:   true,
          desiredMax:  +this.yearListVanilla[0],
          desiredMin:  +this.yearListVanilla[this.yearListVanilla.length - 1],
          currentMin:  +this.yearListVanilla[this.yearListVanilla.length - 1],
          currentMax:  +this.yearListVanilla[0] 
        }
    }
    // Just practising with Promise
     return new Promise((res, rej) => {
       let name = "string" 
       res(name);
     });
  }

  /*APPEND QUARTERLY DISPLAY*/
  private formatDisplayList(): void {

    let size = this.yearListBeta.length * 4;
    let newList = new Array<string>(size);
 
    /* Loop based on variable size newList
       i references legacy yearList, will incriment every 4th iteration
       k represents a quarter, will reset to 4 after it reaches 0
       c is the counter which represents the size of the new array
    */

    if(this.direction){
      for(let i = 0, k = 4, c=0; c < size; k--, c++){
          // Check if we need to incriment varaible    
          if(k === 0){k = 4;i++;}

          //Save new slot in Array
          newList[c] = "Q" + k + " " + this.yearListBeta[i];
          }
    } else {
      for(let i = 0, k = 1, c=0; c < size; k++, c++){
        // Check if we need to incriment varaible    
        if(k === 5){k = 1;i++;}

        //Save new slot in Array
        newList[c] = "Q" + k + " " + this.yearListBeta[i];
        }
    }

    this.yearListFinal = newList;
 }
  
  /* THIS FUNCTION WILL ADD OR SUBTRACT COMPANIES AND TIME-PERIODS ACCORDINGLY */
  public readjustDisplayList(): void {

    console.log("readjust")
    console.log(this.yearRange)
    // Max - Right value has changed
    if(this.yearRange.desiredMax !== this.yearRange.currentMax){
     
      // If desired is under the Max - Subtract from front of array
      if(this.yearRange.desiredMax < this.yearRange.currentMax){
        
        this.removeYears( this.yearRange.currentMax , 
                          this.yearListBeta.indexOf( (this.yearRange.desiredMax + 1).toString() ));
      }else{
        // Add to front of Array.. Desired Max is greater than Current.
         let difference = this.getDifference(this.yearRange.desiredMax, this.yearRange.currentMax)
         this.appendToYearsFront(this.yearListVanilla.indexOf(this.yearRange.desiredMax.toString()), difference)
      }

    }

    // Min - Left value has changed
    if(this.yearRange.desiredMin !== this.yearRange.currentMin){
      
      // Subtract from Rear
      if(this.yearRange.desiredMin > this.yearRange.currentMin){
        this.removeYears(this.yearRange.desiredMin, 
                         this.yearListBeta.indexOf( (this.yearRange.currentMin + 1).toString() ))
      } else {
        // Add to Rear..Desired Min is below Current, therefore adding
         let difference = this.getDifference(this.yearRange.currentMin, this.yearRange.desiredMin)
         this.appendToYearsRear(this.yearListVanilla.indexOf(this.yearRange.currentMin.toString()), difference)
      }

    }

    //Assign to new list & check if quarterly
    if(!this.period)
      this.formatDisplayList();

  }

  private getDifference(A: number, B: number): number {
    return A - B;
  }

  private appendToYearsFront(index: number, difference: number){
    for(let i = 0; i < difference; i++){
      this.yearListBeta.unshift(this.yearListVanilla[index + i])
    }
  }

  private appendToYearsRear(index: number, difference: number){
    for(let i = 0; i < difference; i++){
      this.yearListBeta.push(this.yearListVanilla[index + i])
    }
  }

  private removeYears(index: number, difference: number){
    this.yearListBeta.splice(index, difference); 
  }

}