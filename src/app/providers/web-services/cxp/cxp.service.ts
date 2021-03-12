import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CxpService {

  constructor(
    public http: HttpClient
  ) {}

  private urlRelease = '/api/';
  // private urlRelease = 'http://192.168.11.15:9091/api-coexpan-debug';

  public cxpBrEnviarIngreso(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.urlRelease}/wscoexpan/logistica/bodegarenca/ionicingreso`, JSON.stringify(data))
        .subscribe( res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }

  public cxpBrEnviarEgreso(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.urlRelease}/wscoexpan/logistica/bodegarenca/ionicegreso`, JSON.stringify(data))
        .subscribe( res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }


}

