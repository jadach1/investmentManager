import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { asset } from '../../../models/Manager/asset';
import {map} from 'rxjs/operators';
import { Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private Url = 'http://localhost:8080/api/';  // URL to web api

  constructor(private http: HttpClient) { }

  // Return a single asset from the database table assets
  getAsset(id: string): Observable<asset> {
    const url = `${this.Url + 'currentassets'}/${id}`;
    let existingAsset = new asset();
    //return this.http.get<asset>(this.Url+'currentassets'+'/'+id);
    return this.http.get<asset>(url);
  }

  // return all assets from the database table assets
  getAllAssetsByType (type: string): Observable<asset[]> {
    // type referse to the assettype: existing, archived, pure
    const route = type == "all" ? "currentassets" : "allassets/"+type;
    return this.http.get<asset[]>(this.Url+route)
  }

  // return all assets from the database table assets
  getAllAssetsByOwner (type: string, ownerid: number): Observable<asset[]> {
    // type referse to the assettype: existing, archived, pure
    const route =  "allassets/"+type+"/"+ownerid;
    return this.http.get<asset[]>(this.Url+route)
  }

  // create an asset
  createAsset(asset: asset): Observable<asset> {
    return this.http.post<asset>(this.Url+'currentassets', asset, httpOptions);
  }

  // update an asset in database
  updateAsset (asset: asset): Observable<any> {
    return this.http.put(this.Url+'currentassets', asset, httpOptions);
  }

  // delete an asset
  deleteAsset (id: number) {
    return this.http.delete(this.Url+'currentassets/'+id, httpOptions);
  }

  /*******************ARCHIVED ASSETS  *****************************/
  // Create an archived Asset
  transferToArchive(id: any, status: any) {
    return this.http.put(this.Url+'transferAsset/'+id+"/"+status, httpOptions);
  }

  // Return a single asset from the database table assets
  getAssetIfExisting(symbol: string,ownerid: number): Observable<asset> {
    const url = `${this.Url + 'currentExistingAssets'}/${symbol}/${ownerid}`;
    return this.http.get<asset>(url);
  }
  
}
