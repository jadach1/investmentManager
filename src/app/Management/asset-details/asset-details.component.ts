import { Component, OnInit, Input } from '@angular/core';
import { transaction }              from '../../../Models/Manager/transactions';
import { asset, mockAsset }                    from '../../../Models/Manager/asset';
import { whatIfAsset }              from '../../../Models/Manager/whatIfAsset';
import { AssetService }             from '../../Services/Manager/asset.service';
import { TransactionsService }      from '../../Services/Manager/transactions.service';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.css']
})
export class AssetDetailsComponent implements OnInit {
  myAsset        = new asset();
  displayAsset   = new mockAsset();
  transactions:     transaction[];
  newPrice:         number = 0;
  // what if scenario below
  whatIf         = new whatIfAsset();

  constructor( 
    private assetService: AssetService,
    private transactionService: TransactionsService,
    private location: Location,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
   this.grabAssetAndConvert();
  }

  private grabAssetAndConvert(): void {
     // Fetch our asset from DB and convert the numbers into strings, 'symbol' is param passed by router
     this.assetService.getAsset( this.route.snapshot.paramMap.get('id'))
     .subscribe(
                value => { // upon success, set value and call function to convert  
                        this.myAsset = value, 
                        this.convert()
                      }, 
                error => alert("This symbol does not exist"),
                () => this.displayTransactions("all") 
              );      
  }

  // convert number and decimals like 1111.42 into 1,111.00
  private convert(): void {
    this.displayAsset.shares        = this.myAsset.shares.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.sharesSold    = this.myAsset.sharesSold.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.avgprice      = this.myAsset.avgprice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.avgpriceSold  = this.myAsset.avgpriceSold.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.originalMoney = this.myAsset.originalMoney.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.totalMoneyIn  = this.myAsset.totalMoneyIn.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.totalMoneyOut = this.myAsset.totalMoneyOut.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.price         = this.myAsset.price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.currentTotal  = this.myAsset.currentTotal.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.realProfit    = this.myAsset.realProfit.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.realMargin    = this.myAsset.realMargin.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.unRealProfit  = this.myAsset.unRealProfit.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.unRealMargin  = this.myAsset.unRealMargin.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  public updatePrice(newPrice:number): void {
      // This will uodate the current price as well as calculate the currentTotal and other totals.
      new Promise(res=> res(
        this.myAsset.price = newPrice
      )).then(res=>{
        this.myAsset.currentTotal = this.myAsset.price * this.myAsset.shares;
      }).then(res=> {
        this.myAsset.realProfit = this.myAsset.totalMoneyOut - this.myAsset.totalMoneyIn;
        this.myAsset.unRealProfit = this.myAsset.totalMoneyOut * 1 + this.myAsset.currentTotal - this.myAsset.totalMoneyIn;
      }).then(res=> {
        this.myAsset.realMargin =   this.myAsset.realProfit / this.myAsset.totalMoneyIn  * 100;
        this.myAsset.unRealMargin = this.myAsset.unRealProfit / this.myAsset.totalMoneyIn * 100;
      }).then(res => {
        this.assetService.updateAsset(this.myAsset)
        .subscribe(res=> this.grabAssetAndConvert(), err=> alert("failed to update asset"))
      }).catch(err =>{
          alert("error when trying to update Price " + err)
      });
  }

  public displayTransactions(displayType: string): void {
    // return transactions based on transactions being true, false or all
      this.transactionService.getTransactionsByAsset(displayType,this.myAsset.symbol)
      .subscribe(
                  res=> this.transactions = res,
                  err=> alert("failed to connect to database"),
                  () => this.convertTransactions()
                );
  }

  public whatIfScenario(): void {
      // We will calculate the prices for the what if scenario
      new Promise(res => res(
        // how much money we will get out at the what if price
        this.whatIf.totalMoneyOut = this.whatIf.whatIfPrice * this.myAsset.shares
      )).then(res =>{
        // how much profit will we make 
        this.whatIf.pureProfit = this.whatIf.totalMoneyOut - this.myAsset.originalMoney;
      }).then(res =>{
        // calculate profit margin
        this.whatIf.pureProfitMargin = ( this.whatIf.pureProfit  / this.myAsset.originalMoney ) * 100
      }).then(res =>{
        // how many shares do we need to sell to get our ORIGINAL MONEY back
        this.whatIf.sharesToSell = this.myAsset.originalMoney / this.whatIf.whatIfPrice ;
      }).then(res =>{
        // round all the values
        this.whatIf.totalMoneyOut =  this.whatIf.totalMoneyOut.toFixed(2);
        this.whatIf.pureProfit = this.whatIf.pureProfit.toFixed(2);
        this.whatIf.pureProfitMargin = this.whatIf.pureProfitMargin.toFixed(2);
        this.whatIf.sharesToSell = Math.round(this.whatIf.sharesToSell);
      }).then(res=>{
        // convert to strings for user appeal ex 1000 to 1,000
        this.whatIf.totalMoneyOut =  this.whatIf.totalMoneyOut.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        this.whatIf.pureProfit = this.whatIf.pureProfit.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        this.whatIf.pureProfitMargin = this.whatIf.pureProfitMargin.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        this.whatIf.sharesToSell = this.whatIf.sharesToSell.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      })
  }

  // convert the format of the transactions from 100000 to 1,000,000.00
  private convertTransactions(): void{
    this.transactions.forEach(element => {
      element.price = element.price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      element.total = element.total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      element.shares = element.shares.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    });
  }
}
