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
        minYear:   number;
        maxYear:   number;
        thumbnail: boolean;
        value:     number;
        oldValue:  number
  };

  constructor(private analMidServe: AnalysisMidwayService, 
              private msgServe: MessageService,
              private colourGen: ColourGeneratorService) { }

  ngOnInit(): void {

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
          minYear:   +this.yearListVanilla[this.yearListVanilla.length - 1],
          maxYear:   +this.yearListVanilla[0],
          thumbnail: true,
          value:     +this.yearListVanilla[this.yearListVanilla.length - 1],
          oldValue:  +this.yearListVanilla[this.yearListVanilla.length - 1]
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
    // If value hasn't changed, return
    if(this.yearRange.value === this.yearRange.oldValue) {
      return null;
    }

    //does value exist on current array
     let index = this.yearListBeta.indexOf(this.yearRange.value.toString());
    
     let difference;
    
    // If Descending and want years appended
    if(index === -1 ){

      difference = this.getDifferenceInYears();

      //Grab position of value in original array
       let base = this.yearRange.oldValue.toString();

      //Grab position from new yearListVanilla
       index = this.yearListVanilla.indexOf(base) + 1;

      // Iterate the difference between the old and new years
      for(let i = 0; i < difference; i++){

        //Append from the yearListVanilla, start form the oldValue
         let element = this.yearListVanilla[index + i];

        //Add to the front of the array
         this.yearListBeta.push(element)
         
      } 
      // Pop off unwanted years
    } else {

      if(this.direction)
        difference = this.yearRange.value - this.yearRange.oldValue;
      else 
        difference = this.yearRange.maxYear - this.yearRange.value;

        console.log(difference + " difference: index = " + index)

        // Get rid of everything after index, that is why we add 1 to the index
         this.yearListBeta.splice(index + 1, difference)      
    } 

    // Make sure we set the oldValue to the value we are changing too
    this.yearRange.oldValue = this.yearRange.value;

    // See if we need to reformat the yearListFinal
    if(!this.period)
      this.formatDisplayList();
  }

  //Returns the difference between years 
 private getDifferenceInYears(): number {
    if(this.direction)
       return this.yearRange.oldValue - this.yearRange.value;
    else
       return  this.yearRange.value - this.yearRange.oldValue;
  }
}
