import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {AnalysisService}        from '../../Services/Analyser/analysis.service'
import {AnalysisMidwayService}  from '../../Services/Analyser/analysis-midway.service'
import {MessageService}         from '../../Services/Messages/message.service'
import {Company, CompanyResults}                from '../../../Models/Analyser/Company'
import {MiscLibrary, ColourGenerator}            from '../../Misc/Functionality/miscLibrary'


@Component({
  selector: 'app-main-analysis',
  templateUrl: './main-analysis.component.html',
  styleUrls: ['./main-analysis.component.css']
})

export class MainAnalysisComponent implements OnInit, OnDestroy {

  //DISPLAY VARIABLES
   companyDisplayed: string;
   periodDisplayed: string;  
   companyFinancials: CompanyResults;
   masterCompanyList: CompanyResults[] = [];
   masterCompanySub: Subscription;

  constructor(private analService: AnalysisService,
              private analMidService: AnalysisMidwayService,
              public messageService: MessageService, 
              public miscLib: MiscLibrary,
              public colourGenerator: ColourGenerator) {}

  ngOnInit(): void {
    //Subscribe to MAsterList in Service and keep it updated
    this.masterCompanySub = this.analMidService.sharedMasterList.subscribe(
      list => this.masterCompanyList = list,
      err  => this.messageService.addError("Failed to get Master List")
    )
    this.messageService.sendToast("hello world","321",1);
    this.messageService.sendToast("hello world 2","321",2);
    this.messageService.sendToast("hello world 3","321",3);
    this.messageService.sendToast("hello world 4","321",4);
  }


  ngOnDestroy(): void {
      //Prevent Memory Leaks by Unsubscribing
      this.masterCompanySub.unsubscribe();
  }


  //Take a name of a company and returns a colour corresponding to the first letter
  public getColour(str: string):String {
    return this.colourGenerator.generateByLetter(str);
  }
  
  

    /***************************************************************************\
      TESTING
  \****************************************************************************/


  public isListEmpty() : boolean {
    return this.masterCompanyList.length != 0 ? true : false;
  }
 
}
