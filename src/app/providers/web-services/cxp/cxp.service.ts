import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CxpService {

  constructor(
    public http: HttpClient
  ) {}

  // private urlRelease = '/debug';
  // private urlRelease = '/api-coexpan-debug';
  private urlRelease = 'http://192.168.11.15:9091/api-coexpan-debug/wscoexpan';

  //#region BODEGA PLANTA
  // logistica/scan-em
  public cxpLogisticaEntradaMercancia(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.urlRelease}/logistica/scanner/em`, JSON.stringify(data))
        .subscribe( res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }

  public cxpLogisticaSalidaMercancia(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.urlRelease}/logistica/scanner/sm`, JSON.stringify(data))
        .subscribe( res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }
  //#endregion

  //#region BODEGA RENCA
  public cxpBrEnviarIngreso(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.urlRelease}/logistica/bodegarenca/ionicingreso`, JSON.stringify(data))
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
      this.http.post(`${this.urlRelease}/logistica/bodegarenca/ionicegreso`, JSON.stringify(data))
        .subscribe( res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }
  //#endregion

}

