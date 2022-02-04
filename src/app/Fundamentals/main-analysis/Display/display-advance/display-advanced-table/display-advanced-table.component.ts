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
  @Input() yearList: number[] = [];
      yearMin: number;
      yearMax: number;
  
  hide = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
    console.log("Inside")
  }

  public hideTable(){
    this.hide.emit(true);
  }

  //Checks to see if a Category exists
  public isCategoryViewable(): boolean {
    let exists: boolean = false;
    try {
      this.categoriesSelected.forEach( category => {
        if (category === this.categorySelected) {
          throw "category"
        }
      })
    } catch (category) {
      if(category != "category") {
        throw category;
      }
      console.log("caught " + category)
      return true;
    }
    return exists;
  }
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

                  //Sets a marker for which year we are comparing
                  let  marker = 0;  

                  //Get each value based on desired category
                  company.results.forEach(period => {     

                      for(let i = marker; i < this.yearList.length; i++){

                        console.log(marker + " " + period.year + ": " + this.yearList[i])
                        if(period.year == this.yearList[i]){
                          tempArray.push(period.data.get(this.categorySelected));
                          marker = i++;
                          console.log("g")
                          break;
                        } else {
                          tempArray.push(0);
                        }
                      }
                      console.log("end")

                  }) // for each company.result

                  throw "array";
              } // if 
        }
        
        ) // forEach
    } catch (array) {
      if (array != 'array') throw array;
      console.log("caught error " + array);
    }
      return tempArray;
  }

  

  public execute(){
    this.listOfCompanies.splice(0)
  }
}
