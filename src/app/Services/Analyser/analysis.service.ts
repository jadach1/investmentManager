import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {MessageService} from '../Messages/message.service'

import {Company} from '../../../Models/Analyse/Company'

const COMPANIES: Company[] = [
  {  id:1,name:"MSFT",year:2018,quarter:"",Revenue:100,MarketCap: 1000,PE: 45,EPS: 5,Price:100,NetIncome: 1534},
  {  id:1,name:"MSFT",year:2019,quarter:"",Revenue:140,MarketCap: 1500,PE: 75,EPS: 6 ,Price:167,NetIncome: 1965},
  {  id:1,name:"MSFT",year:2020,quarter:"",Revenue:219,MarketCap: 2245,PE: 87,EPS: 8 ,Price:254,NetIncome: 3222},
  {  id:1,name:"AMZN",year:2018,quarter:"",Revenue:50,MarketCap: 800,PE: 100,EPS: -1 ,Price:676,NetIncome: -12},
  {  id:1,name:"AMZN",year:2019,quarter:"",Revenue:90,MarketCap: 1100,PE: 150,EPS: -5,Price:876,NetIncome: -343},
  {  id:1,name:"AMZN",year:2020,quarter:"",Revenue:109,MarketCap: 1985,PE: 226,EPS: 2,Price:999,NetIncome: 123},
  {  id:1,name:"GOOG",year:2018,quarter:"",Revenue:88,MarketCap: 543,PE: 23,EPS: 23  ,Price:234,NetIncome: 1456},
  {  id:1,name:"GOOG",year:2019,quarter:"",Revenue:323,MarketCap: 643,PE: 654,EPS: 54,Price:432,NetIncome: 1243},
  {  id:1,name:"GOOG",year:2020,quarter:"",Revenue:109,MarketCap: 1234,PE: 123,EPS: 66,Price:456,NetIncome: 1890},
]

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  constructor(private messageService: MessageService) { }

  getCompanies(): Observable<Company[]>{
     const companies = of(COMPANIES);
     this.messageService.add('Analysis Service: Fetched Companies');
     return companies;
  }
}
