import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  private baseUrl = 'http://localhost:8080'; // 後端 API URL

    // 新增問卷
  postApi(url: string, postData: any): any {
    return this.httpClient.post( this.baseUrl  +  '/'  + url, postData);
  }

 // 取得問卷列表
  getApi(url: string, getData: any): any{
    return this.httpClient.get(this.baseUrl  +  '/'  + url, getData);
  }

  // 取得選樣列表
  getOptionApi(url: string, getData: any): any {
  const params = new HttpParams({ fromObject: getData }); // 將物件轉成 query string
  return this.httpClient.get(this.baseUrl + '/' + url, { params });
}

    // 更新問卷
  updateQuiz(url: string, postData: any): any{
    return this.httpClient.put(this.baseUrl  +  '/'  + url, postData);
  }

  // 刪除問卷
  deleteQuiz(url: string, postData: any): any {
    return this.httpClient.delete(this.baseUrl  +  '/'  + url, postData);
  }


}
