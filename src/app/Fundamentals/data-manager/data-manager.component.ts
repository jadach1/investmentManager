import { Component, OnInit } from '@angular/core';

import {AnalysisService}       from '../../Services/Analyser/analysis.service'
import {MessageService}        from '../../Services/Messages/message.service'
import {AnalysisMidwayService} from '../../Services/Analyser/analysis-midway.service'
import { CompileShallowModuleMetadata } from '@angular/compiler';


@Component({
  selector: 'app-data-manager',
  templateUrl: './data-manager.component.html',
  styleUrls: ['./data-manager.component.css']
})

  
export class DataManagerComponent implements OnInit {

  companies: string[];
  selectedCompany: string = "";
  period: string = "year";
  symbol: string;
  statement: string = "";
  
  
  constructor(private analService: AnalysisService, 
              public msgService: MessageService,
              private analMidService: AnalysisMidwayService
              ) { }

  ngOnInit(): void {
   this.getNames()
  }


  //Sets the name of the Company we will be viewing
  public selectCompanyName(name) {
      this.selectedCompany = name;
  }

  //Sets the period of Data we will be fetching from
  public setPeriod(p: string) {
    if(p != "")
      this.period = p;
  }

  //Get Data from 3rd party API
  //This should be in a service, tier 1
  public downloadData() {
       //Get Data from API
      let tempArray = this.analService
                      .getFinancialData(this.selectedCompany,this.statement,this.period)
                      .subscribe(
                                  res => tempArray = res,
                                  err => console.log("failed getting financial Data: " + err),
                                  // Manage Data Retrieved
                                  ()  => this.analMidService.parseFinancialData(tempArray,this.statement,this.period)
                                      .then(
                                            // Post Desired data to DB
                                            financialList => this.analService.postFinancialData(financialList)
                                                .subscribe(
                                                              error => this.msgService.addError("failure to upload financial statments"),
                                                              ()    => this.msgService.add("Completed in task: Uploading " + this.statement + " for " + this.selectedCompany)
                                                )
                                            )
                      )
  }

  public createProfile(name: string) {

  }
  
  /************************************************************
    REFERENCE LIST OF AVAILABLE COMPANY NAMES TO GET DATA FROM
  ************************************************************/

  private getNames() {
    this.companies = [];
    this.analMidService.getAssetNames().subscribe(
      res => this.companies = res,
      err => this.msgService.addError("getAssetNames failed: " + err)
    )
  }

  //Adds a name to the database's list of company names
  public addName() {
    if (this.symbol != ""){
        this.analService.newAssetName(this.symbol)
                      .subscribe(
                                    res => console.log(res),
                                    err => this.msgService.add(err.toString())
                                )
        }  
  }

  public dropName(name: string) {
    this.analService.deleteName(name)
        .subscribe(
                    res => console.log(res),
                    err => {this.msgService.sendToast("error deleting " + name,"Drop Name",2), console.log(err)},
                    () => this.getNames()
         )
  }
}
