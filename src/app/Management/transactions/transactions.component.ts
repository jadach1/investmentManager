import { Component, OnInit }  from '@angular/core';

import {transaction}          from '../../../Models/Manager/transactions'
import {TransactionsService}  from '../../Services/Manager/transactions.service'
import {MessageService}       from '../../Services/Messages/message.service'


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  // Hold the transactions
  transactions: transaction[];
  //Create private Transaction Service and Public message Service
  constructor(private trannyService: TransactionsService,
              public messageService:     MessageService) { }

  ngOnInit(): void {
    console.log("in")
      this.getTrannies();
  }

  public getTrannies(){
    console.log("in")
    this.trannyService.getAllTransactions()
                      .subscribe(
                                  res => this.transactions = res,
                                  err => this.messageService.add("Couldn't fetch all transactions:  " + err)
                      );
  }

  // returns the colour of the transaction: red for f , green for t
  public getColour(colour: boolean): string{
    let str = "white";
    if (colour == true){
      str = "green";
    } else if (colour == false){
      str = "red"
    }
    console.log(colour)
    return str;
  }

}
