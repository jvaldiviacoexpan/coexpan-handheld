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
  // private UrlRelease = '/api-coexpan/debug'
  private urlRelease = 'http://192.168.11.15:9094/api-coexpan/debug/wscoexpan';

  //#region PRINCIPAL
  //#endregion PRINCIPAL

  //#region BODEGA PLANTA
  public obtenerToken(id: string) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.urlRelease}/security/obtenertoken`, JSON.stringify(id))
        .subscribe( res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }


  public cxpLogisticaEjecutarEtlPesaje() {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.urlRelease}/logistica/scanner/initpesaje`)
        .subscribe( res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }


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


  public cxpLogisticaImprimirEtiquetaMultimple(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.urlRelease}/logistica/bodegaplanta/ang-imprimiretq`, JSON.stringify(data))
        .subscribe( res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }

  public cxpLogisticaGetPalletBobinas(codbarramulti: string) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.urlRelease}/logistica/scanner/obtenerpallet`, JSON.stringify(codbarramulti))
        .subscribe( res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  public cxpLogisticaenviarEntradaMercancia(datos: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.urlRelease}/logistica/scanner/postem`, JSON.stringify(datos))
        .subscribe( res => {
          resolve(res);
        }, (err) => {
          reject(err);
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

  //#region METODOS GENERICOS
  public cxpLogisticaLogin(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.urlRelease}/security/login`, JSON.stringify(data))
        .subscribe( res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }

  public cxpLogisticaLogout(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.urlRelease}/security/logout`, JSON.stringify(data))
        .subscribe( res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }

  public cxpLogisticaGetImpresora() {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.urlRelease}/dashboard/getimpresoras`)
        .subscribe( res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }

  public cxpEstadoImpresora(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.urlRelease}/impresora/estado`, JSON.stringify(data))
        .subscribe( res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }
  //#endregion METODOS GENERICOS

  //#region METODOS bp-etq-reimprimir
  public cxpObtenerInformacionEtiquetaPallet(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.urlRelease}/logistica/scanner/getinfoetq`, JSON.stringify(data))
        .subscribe( res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }

  public cxpReimprimirEtiquetaPallet(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.urlRelease}/logistica/scanner/reimprimiretq`, JSON.stringify(data))
        .subscribe( res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }
  //#endregion METODOS bp-etq-reimprimir

}

