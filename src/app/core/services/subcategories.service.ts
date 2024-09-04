import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService {

  constructor(private readonly _HttpClient:HttpClient) { }

  // getAllSubCategories():Observable<any>{
  //   return this._HttpClient.get(`${environment.baseUrl}/api/v1/categories`)
  // }
  getAllSubCategoriesOnCatgories(id:string):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/categories/${id}/subcategories`)
  }
}
