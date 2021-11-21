import { Component, OnInit }        from '@angular/core';

import { owners }                   from '../../../Models/Manager/owner'
import { OwnerContributionService } from '../../Services/Manager/owner-contribution.service'
import { asset }                    from '../../../Models/Manager/asset'
import { transaction }              from '../../../models/manager/transactions'

import { AssetService }             from '../../Services/Manager/asset.service'
import { TransactionsService }      from '../../Services/Manager/transactions.service'
import { MessageService }           from '../../Services/Messages/message.service'
import {ColourGeneratorService}     from '../../Services/Misc/colour-generator.service'

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {
  assetObject:        asset       = new asset();
  newTransaction:     transaction = new transaction();
  owners:             owners[];

  constructor(private ownerService: OwnerContributionService,
              private assetService: AssetService,
              private transactionService: TransactionsService,
              public messageService: MessageService,
              public colourGenerator: ColourGeneratorService) { }

  ngOnInit(): void {
    this.getOwners()
  }

  //Form
  public onSubmit(form) {
    console.log(this.newTransaction.ownerid + ", " + this.newTransaction.symbol + ", " + this.newTransaction.buydate + ", " + this.newTransaction.price + ", " + this.newTransaction.transaction + ", ")
    new Promise( 
                res =>   res(this.newTransaction.total = this.newTransaction.shares * this.newTransaction.price)
                ).then(          
                  r => 
                        this.transactionService.addTransaction(this.newTransaction)
                              .subscribe(
                                    res => this.identifyAsset(this.newTransaction),
                                    err => console.log("Error in Adding new Transaction")
                                )
                  )
  
    }

    public clearForm(form){
        form.reset()
    }
    
   // Subscriptions
   public getOwners(): void{
    this.ownerService.getOwners()
                    .subscribe(res => this.owners = res,
                               err => console.log("Error Retrieving Owners"),
                                () => console.log("called owners"))
  }

   /*********************UPDATE/CREATE Asset With New Transaction****************************/

  //ATTEMPT TO PULL ASSET FROM DATABASE
  identifyAsset(Transaction: transaction): void{
    //Create empty Asset
     let Asset = new asset();
      //First lets check to see if the asset exists
      this.assetService.getAssetIfExisting(Transaction.symbol,Transaction.ownerid).subscribe(
        // asset exists, update it and send it to update asset
         res => Asset = res,
        // Asset doesn't exist, create it, make a flag, a call create new asset
         err => Asset = err,
        //Depending on whether the asset exists or not, we will either create or update
         ()  => this.buildAssetPhaseOne(Asset,Transaction) 
      )

  }
  
  //CREATE NEW ASSET OR SEND EXISTING ASSET TO BE UPDATED
  buildAssetPhaseOne(Asset: asset,Transaction: transaction){
      if(Asset == null){
          let newAsset = new asset();
          new Promise( res => res( newAsset.symbol = Transaction.symbol))
                  .then( r =>  newAsset.assettype = "existing")
                  .then( r =>  newAsset.ownerid = Transaction.ownerid)
                  .then( r =>  this.buildAssetPhaseTwo(newAsset,Transaction))
                  .then( r =>  this.buildAssetPhaseThree(newAsset))
                  .then( r =>  this.createNewAsset(newAsset))
                 .catch(err => console.log("Error in perpareAsset : " + err))
      } else {
        new Promise( res =>  res(this.buildAssetPhaseTwo(Asset,Transaction)))
                 .then(r =>  this.buildAssetPhaseThree(Asset))
                 .then(r =>  this.updateExistingAsset(Asset))
                .catch(err => console.log("Error in perpareAsset alive : " + err))
      }
  }

  //DEALS WITH ADDING OR SUBTRACTING SHARES AND TOTAL MONEY IN OR OUT
  buildAssetPhaseTwo(Asset: asset,Transaction: transaction): void{
      console.log("two")
      Asset.price = Transaction.price;
      //If the Transaction type is Selling or Buying will determine what we calculate
      if(Transaction.transaction == "t"){
          Asset.shares       = Number(Asset.shares) + Transaction.shares
          Asset.totalMoneyIn = Number(Asset.totalMoneyIn) + Transaction.shares * Transaction.price
      } else {
          Asset.sharesSold    = Number(Asset.sharesSold) + Transaction.shares
          Asset.totalMoneyOut = Number(Asset.totalMoneyOut) + Transaction.shares * Transaction.price  
          Asset.shares        = Number(Asset.shares) - Transaction.shares
         // If we are selling, check to see if any shares remain or else Archive Asset
         if(Asset.shares <= 0)
              Asset.assettype = "archived"
      }  
  }

  //CALCULATES MISC OF ASSET
  buildAssetPhaseThree(Asset: asset): void{
    console.log("three")
     Asset.currentTotal = Asset.price * Asset.shares;
    //avg shares price: price / shares
     Asset.totalMoneyOut != 0 ? Asset.avgpriceSold = Asset.totalMoneyOut / Asset.sharesSold : 0;
    //original money : moneyin - out
     Number(Asset.totalMoneyIn) - Number(Asset.totalMoneyOut) >= 0 ? Asset.originalMoney =  Number(Asset.totalMoneyIn) - Number(Asset.totalMoneyOut) : Asset.originalMoney = 0;
    //real profit, margin
     Asset.realProfit =   Asset.totalMoneyOut - Asset.totalMoneyIn,
     Asset.realMargin =   Asset.realProfit / Asset.totalMoneyIn * 100,
     Asset.unRealProfit = Asset.currentTotal - Asset.totalMoneyIn,
     Asset.unRealMargin = Asset.unRealProfit / Asset.totalMoneyIn * 100
     Asset.avgprice =     Asset.totalMoneyIn / (Number(Asset.shares) + Number(Asset.sharesSold)); 
  }

  createNewAsset(Asset: asset): void{
    this.assetService.createAsset(Asset)
                    .subscribe(
                                res => this.messageService.add('Successfully Created Asset: ' + Asset.symbol),
                                err => this.messageService.add("Failed to Create New Asset due to error: " + err)
                    )
  }

  updateExistingAsset(Asset: asset): void{
    this.assetService.updateAsset(Asset)
                  .subscribe(
                               res => this.messageService.add("Successfully Updated Asset: " + Asset.symbol),
                               err => this.messageService.add("Error Updating Asset: " + Asset.symbol + " " + err)
                  )      
  }

}
