import { Component, OnInit }      from '@angular/core';
import { NgbModule }                from '@ng-bootstrap/ng-bootstrap';

import {asset}                    from '../../../Models/Manager/asset'
import {owners}                   from '../../../Models/Manager/owner' 

import {AssetService}             from '../../Services/Manager/asset.service'
import {ColourGeneratorService}   from '../../Services/Misc/colour-generator.service'
import {OwnerContributionService} from '../../Services/Manager/owner-contribution.service'
import {AnalysisService}          from '../../Services/Analyser/analysis.service'
import { Company }                from 'src/Models/Analyser/Company';  
import { MessageService }         from 'src/app/Services/Messages/message.service';

@Component({
  selector: 'app-asset-dashboard',
  templateUrl: './asset-dashboard.component.html',
  styleUrls: ['./asset-dashboard.component.css']
})

export class AssetDashboardComponent implements OnInit {
  assets:       asset[];
  assetType:    string = "existing";
  ownerType:    number = 1;
  owners:       owners[];

  // For Top Dashboard
  totalIn:      any = 0; 
  totalOut:     any = 0; 
  currentTotal: any = 0;

  //An array of prices to update stocks
  pricesArray: Company[];

  constructor(private assetService: AssetService,
              public colourGenSer: ColourGeneratorService,
              private ownerService: OwnerContributionService,
              private analService: AnalysisService,
              public messageService: MessageService) { 
              }

  ngOnInit(): void {
    this.getAssets(this.assetType,1);
    this.getOwners();
  }

  getOwners(): void{
    this.ownerService.getOwners()
                .subscribe(
                            res => this.owners = res,
                            err => console.log("Error fetching owners"),
                            ()  => console.log("Done getting all owners for dashboard")
                )
  }

  // Clear all assets and displays first;
  // Then fetch assets
  getAssets(type: string, owner: number): void{
    new Promise(res => res(this.clearAssets()))
              .then( res => 
                          //Fetch all existing assets by owner id
                            this.assetService.getAllAssetsByOwner(type,owner)
                                                .subscribe(
                                                            res => this.assets = res,
                                                            err => console.log("Error fetching all assets"),
                                                            ()  => this.getTotal()
                                                          )
                )
 
  }

  /* Will Calculate the:
        TotalMoneyIn,TotalMoneyOut,CurrentTotal sums from the assets array
  */
  private getTotal(): void{
      new Promise(res => res(this.totalPartOne()))
            .then(res => this.totalPartTwo())
  }

  private totalPartOne(): void{
    this.assets.forEach(element => {
      this.totalIn = Number(this.totalIn) + Number(element.totalMoneyIn);
      this.totalOut += Number(element.totalMoneyOut);
      this.currentTotal = Number(this.currentTotal) + element.shares * element.price;
   });
  }

  private totalPartTwo(): void{
    var nf = new Intl.NumberFormat();
    this.totalIn = nf.format(this.totalIn)
    this.totalOut = nf.format(this.totalOut)
    this.currentTotal = nf.format(this.currentTotal)
  }

  /***************************************** */
  private clearAssets(): void{
    this.assets = null;
    this.totalIn = 0;
    this.totalOut = 0;
    this.currentTotal = 0;
  }

  private assetDetails(id: number): void{
      console.log("number " + id)
  }

  // Generates the Back Colours of the Assets
  public fetchBackColour(symbol: string): String{
    return this.colourGenSer.generateByLetter(symbol)
  }

    /***************************************** 
     UPDATING PRICES
     *   /***************************************** */
    
  // Will Attempt to update the prices of the correspondiong Stocks
  public updatePrice(){
    //Clear the pricesArray
     this.pricesArray = [];
    //Check to see if there are any assets
    if (this.assets != null){
      //Go through each asset
      this.assets.forEach(element => {
        //We only want US Companies
        if(element.country == 'US'){
            // Because we are pulling the company info of 1 comapny at a time,
            // We will create a new company on each occurance and pass it to our sub function below
            let comp = new Company();
            //Pull whatever prices and info we can from the net
            this.analService.companyInfo(element.symbol)
                .subscribe(
                            res => comp = res[0],
                            err => console.log(err.error),
                            ()  => this.validatePrice(comp,element)
              )
        }
        
      })
    } else {
      console.log("no assets to update price")
    }
  }
 
  //If the object is not null we will update the existing assets price
  private validatePrice(comp, asset) {
    if (comp != null){
      // Attempt to update the Asset
      if (asset.symbol == comp.symbol){
         this.assetService.updateAssetPrice(asset, comp.price)
                          .then( r  =>  
                                {
                                  console.log("trial " + asset.unRealMargin + " : " + asset.symbol)
                                  this.assetService.updateAsset(asset)
                                        .subscribe(
                                                    res => this.messageService.add("Successfully updated: " + asset.symbol + " , at price: " + asset.price),
                                                    err => console.log(err)
                                   )
                                }
                  )
       
       
      }
      //Update Message Service
      this.messageService.add("Pushing Prices For : " + comp.symbol)
      this.pricesArray.push(comp)
    }
  }

  //View What Prices we have just updated
  public viewPrice() {
    if (this.pricesArray != null ){  
          this.pricesArray.forEach(element => {
          console.log(element)
        })
  }}

}
