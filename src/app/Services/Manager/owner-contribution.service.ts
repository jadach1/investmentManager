import { Injectable }              from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable }              from 'rxjs';
import { owners }                  from '../../../models/Manager/owner';
import { contributions }           from '../../../models/Manager/contributions'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class OwnerContributionService {

  private Url = 'http://localhost:8080/api/';  // URL to web api

  constructor(private http: HttpClient) { }

  // Get all owners
  getOwners(): Observable<owners[]> {
    const url = this.Url + 'owners';
    return this.http.get<owners[]>(url);
  }

   // create an owner
   createOwner(owner: owners): Observable<owners> {
    return this.http.post<owners>(this.Url+'owners', owner, httpOptions);
  }

   // Get all contributions by owner name
   getContributions(ownerid: any): Observable<contributions[]> {
    const url = this.Url + 'contributions/';
    return this.http.get<contributions[]>(url + ownerid);
  }

  contribute(contribution: contributions) {
      return this.http.post<contributions>(this.Url+'contributions',contribution, httpOptions);
  }
}
