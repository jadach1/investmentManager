import { Injectable }              from '@angular/core';
import { Observable }             from 'rxjs';
import {MessageService}            from '../Messages/message.service'
import {Company}                   from '../../../Models/Analyser/Company'
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  list: any[];

  constructor(private messageService: MessageService,
              private http: HttpClient) 
              { }

  // Return API data from external API
  companyInfo(company: string): Observable<Company>{
     let url = 'https://financialmodelingprep.com/api/v3/quote/' + company + '?apikey=3340dea2b67650a5e57a77796910cb55';
     return this.http.get<Company>(url);
  }

  // Get Data fill names
  assetNames(): Observable<object>{
    let url = "http://localhost:8080/api/assetSymbols";
    return this.http.get<object>(url);
  }

  //Creates a new Asset name for list of Assets in Get Data
  newAssetName(symbol: string):Observable<object>{
    let url = "http://localhost:8080/api/insertNewName/" + symbol;
    return this.http.post(url, httpOptions)  
  }

   // Return API data from external API
  getFinancialData(symbol: string,statement: string,period: string):Observable<object>{
    const key = '3340dea2b67650a5e57a77796910cb55';
    let limit: string;
    console.log(period)
    period == "quarter" ? limit = "?period=quarter&limit=400" : limit = "?limit=120";

    let URL   = 'https://financialmodelingprep.com/api/v3/'+statement+'/'+symbol+limit+'&apikey='+key;

    if (symbol == "" || statement == ""){
      console.log("Can't fetch data for blank: " + symbol + " : " + statement)
    } else {
      console.log(URL)
      return this.http.get<object>(URL);
    }
  }

  // Sends Data to DB from 3rd party API
  postFinancialData(data: string[]) {
    let url = "http://localhost:8080/api/uploadFinancialInfo/";
    return this.http.post(url, data, httpOptions) 
  }

  // Returns Distinct company names from the list of companies in financials table
  getCompanyNames(): Observable<object> {
    let url = "http://localhost:8080/api/financialCompanyNames/";
    return this.http.get<object>(url);
  }

   // Returns Distinct Categories and their statement
   getCategories(): Observable<object> {
    let url = "http://localhost:8080/api/getCategories/";
    return this.http.get<object>(url);
  }

  //Returns Quarterly or Yearly Financial Data for a Company After Preparing the Data Call
  getSelectedData(list: Array<string>,company: string,period: string): Observable<object> {
    let categories = "";
    // We have a list of categories ie revenue eps grossprofit
    // We need to transoform them into a single string with ' apostrophe's encapsulating each word and seperated by a comma
    // And make sure the last word doesn't have a comma attached
    for(let x = 0;x < list.length; x++){
      if(x+1 == list.length)
          categories += "'"+list[x]+"'" // this is the end
      else
          categories += "'"+list[x] + "',"
    }
    //Make search string for api
    let str = "singleCompanyCategories/" + categories + "/" + company + "/" + period
    let url = "http://localhost:8080/api/" + str
    return this.http.get<object>(url);
  }

}
