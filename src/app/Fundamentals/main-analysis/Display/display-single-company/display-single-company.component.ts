import { Component, OnInit } from '@angular/core';
import { CompanyResults, Company } from '../../../../../Models/Analyser/Company'
import {AnalysisMidwayService} from '../../../../Services/Analyser/analysis-midway.service'
import {ColourGeneratorService} from '../../../../Services/Misc/colour-generator.service'
import {MessageService} from '../../../../Services/Messages/message.service'

@Component({
  selector: 'app-display-single-company',
  templateUrl: './display-single-company.component.html',
  styleUrls: ['./display-single-company.component.css']
})
export class DisplaySingleCompanyComponent implements OnInit {
  companyMasterList: CompanyResults[] = [];
  myCompany: CompanyResults = undefined;

  constructor(private analMidServe: AnalysisMidwayService,
              public colourGenerator: ColourGeneratorService,
              private msgService: MessageService) { }

  ngOnInit(): void {
    this.companyMasterList = this.analMidServe.getMasterList();
  }

  public selectCompany(company: CompanyResults) {
    this.myCompany = company;
  }

  public companyExists(): boolean {
    return this.myCompany === undefined ?  false: true;
  }

   /***************************************************************************\
      DISPLAY DATA 
  \****************************************************************************/
  //Returns an array of numbers for each category of a companies selected year
  public fetchCategoryValue(category: string): number[] | void{
    let values: Array<number> = new Array<number>();
    this.myCompany.results.forEach(company => {
      values.push(company.data.get(category));
    })
    return values;
  }

  //Take a name of a company and returns a colour corresponding to the first letter
  public getColour(str: string):String {
    return this.colourGenerator.generateByLetter(str);
  }

  //Deletes a member from the MasterCompanyList
  public deleteMe(id: number) {
   console.log(id)
   this.analMidServe.deleteFromMasterList(id)
  }

  //Retrieves the specific categories a specific company has
  public displayCategories(): string[]{
      let temp: string[] = [];
                                    //because categories are uniform across all years
      this.myCompany.results[0].data.forEach( (value,category) => {
        temp.push(category)
      })
      return temp;
  }

    /***************************************************************************\
      SORTING DATA 
  \****************************************************************************/
  // Makes sure this list is sorted by Year - Ascending
  public sortMasterListAsc() {
    for(let i = 0; i < this.myCompany.results.length; i++){
     for(let k = i + 1;k < this.myCompany.results.length;k++){
        if(this.myCompany.results[i].year > this.myCompany.results[k].year){
            let tempCompany = new Company();
            tempCompany = this.myCompany.results[i];
            this.myCompany.results[i] = this.myCompany.results[k];          
            this.myCompany.results[k] = tempCompany;       
        }  // if
     } // for k     
    } // for i
  }

  // Makes sure this list is sorted by Year - Descending
  public sortMasterListDes() {
    for(let i = 0; i < this.myCompany.results.length; i++){
      for(let k = i + 1;k < this.myCompany.results.length;k++){
          if(this.myCompany.results[i].year < this.myCompany.results[k].year){
              let tempCompany = new Company();
              tempCompany = this.myCompany.results[i];
              this.myCompany.results[i] = this.myCompany.results[k];          
              this.myCompany.results[k] = tempCompany;      
        }  // if
      } // for k     
    } // for i
  }
}
