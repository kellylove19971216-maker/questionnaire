import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  private baseUrl = 'http://localhost:8080'; // 後端 API URL

  postApi(url: string, postData: any): any {
    return this.httpClient.post( this.baseUrl  +  '/'  + url, postData);
  }
}
