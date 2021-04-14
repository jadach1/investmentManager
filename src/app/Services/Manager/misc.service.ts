import { Injectable }              from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable   }            from 'rxjs';
import { owners       }            from '../../../models/Manager/owner';
import { contributions }           from '../../../models/Manager/contributions'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MiscService {

  private Url = 'http://localhost:8080/api/';  // URL to web api

  constructor(private http: HttpClient) { }

  // Check if a single value exists in a table
  checkSingle(table: string, column: string, value: any) {
    const url = this.Url + 'misc/check/';
    return this.http.get<owners>(url + table + '/' + column + "/" +  value);
  }

 
}
