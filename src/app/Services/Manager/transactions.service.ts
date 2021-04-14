import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { transaction } from '../../../models/Manager/transactions';
import { archivedTransaction } from '../../../models/Manager/archivedTransactions';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private Url = 'http://localhost:8080/api/';  // URL to web api

  constructor(private http: HttpClient) { }
 
  // get all transactions regardless of bought or sold
  getAllTransactions (): Observable<transaction[]> {
return this.http.get<transaction[]>(this.Url+'allTransactions')
  }

  // get all transactions depending on transaction type
  getTransactions (transactionType: string): Observable<transaction[]> {
    if(transactionType==="buy")
    {
      return this.http.get<transaction[]>(this.Url+'allTransactions/:true')
    }  else if(transactionType==="sell") {
      return this.http.get<transaction[]>(this.Url+'allTransactions/:false')
    } else {
      return this.http.get<transaction[]>(this.Url+'allTransactions')
    }
  }

   // get all transactions of an Asset depending on transaction type
   getTransactionsByAsset (transactionType: string, assetSymbol: string): Observable<transaction[]> {
    if(transactionType==="true")
    {
      return this.http.get<transaction[]>(this.Url+'allAssetTypeTransactions/true/' + assetSymbol)
    }  else if(transactionType==="false") {
      return this.http.get<transaction[]>(this.Url+'allAssetTypeTransactions/false/' + assetSymbol)
    }
    // Return all transactions belonging to the asset Symbol 
    else 
    { 
      return this.http.get<transaction[]>(this.Url+'allAssetTransactions/' + assetSymbol)
    }
  }

  addTransaction (asset: transaction): Observable<transaction> {
    return this.http.post<transaction>(this.Url+'Transaction', asset, httpOptions);
  }

  /*********** ARCHIVED TRANSACTIONS  ***************************/

  // Calls the api to fetch all transaction ID's associated with the new archived asset
  getTransactionsFromArchivedAsset(symbol: string) {
    return this.http.get(this.Url+'freeTransactions/' + symbol)
  }

  // creates a new transaction in the bridge table archivedTransactions
  addArchivedTransaction (asset: archivedTransaction): Observable<archivedTransaction> {
    return this.http.post<archivedTransaction>(this.Url+'newArchivedTransaction', asset, httpOptions);
  }
}
