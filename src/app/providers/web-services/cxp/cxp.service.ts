import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CxpService {

  constructor(
    public http: HttpClient
  ) { }

  //#region BODEGA PLANTA
  public obtenerToken(id: string) {
    return new Promise((resolve, reject) => {
      this.http.post(`${env.URL_API_COEXPAN}/security/obtenertoken`, JSON.stringify(id))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }


  public cxpLogisticaEjecutarEtlPesaje() {
    return new Promise((resolve, reject) => {
      this.http.get(`${env.URL_API_COEXPAN}/logistica/scanner/initpesaje`)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }


  public cxpLogisticaEntradaMercancia(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${env.URL_API_COEXPAN}/logistica/scanner/em`, JSON.stringify(data))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }


  public cxpLogisticaSalidaMercancia(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${env.URL_API_COEXPAN}/logistica/scanner/sm`, JSON.stringify(data))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }


  public cxpLogisticaImprimirEtiquetaMultimple(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${env.URL_API_COEXPAN}/logistica/bodegaplanta/ang-imprimiretq`, JSON.stringify(data))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }


  public cxpLogisticaGetPalletBobinas(codbarramulti: string) {
    return new Promise((resolve, reject) => {
      this.http.post(`${env.URL_API_COEXPAN}/logistica/scanner/obtenerpallet`, JSON.stringify(codbarramulti))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }


  public cxpLogisticaenviarEntradaMercancia(datos: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${env.URL_API_COEXPAN}/logistica/scanner/postem`, JSON.stringify(datos))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }


  public cxpLogisticaEliminarEtiquetaPallet(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${env.URL_API_COEXPAN}/logistica/scanner/eliminaretiqueta`, JSON.stringify(data))
        .subscribe(res => {
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
      this.http.post(`${env.URL_API_COEXPAN}/logistica/bodegarenca/ionicingreso`, JSON.stringify(data))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }

  public cxpBrEnviarEgreso(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${env.URL_API_COEXPAN}/logistica/bodegarenca/ionicegreso`, JSON.stringify(data))
        .subscribe(res => {
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
      this.http.post(`${env.URL_API_COEXPAN}/security/login`, JSON.stringify(data))
        .subscribe(res => {
          console.log(res);
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }

  public cxpLogisticaExtrusionLogin(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${env.URL_API_COEXPAN}/logistica/scanner/login`, JSON.stringify(data))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }

  public cxpLogisticaLogout(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${env.URL_API_COEXPAN}/security/logout`, JSON.stringify(data))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }

  public cxpLogisticaGetImpresora() {
    return new Promise((resolve, reject) => {
      this.http.get(`${env.URL_API_COEXPAN}/dashboard/getimpresoras`)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }

  public cxpEstadoImpresora(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${env.URL_API_COEXPAN}/impresora/estado`, JSON.stringify(data))
        .subscribe(res => {
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
      this.http.post(`${env.URL_API_COEXPAN}/logistica/scanner/getinfoetq`, JSON.stringify(data))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }

  public cxpReimprimirEtiquetaPallet(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${env.URL_API_COEXPAN}/logistica/scanner/reimprimiretq`, JSON.stringify(data))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }
  //#endregion METODOS bp-etq-reimprimir

  // TODO INTEGRACION 20-07-2021 Emision de etiqueta,
  public cxpReimprimirEtiquetaRecepcion(data: any) {
    console.log('Bodega Recepcion 02-03-2023');
    console.log(data);
    return new Promise((resolve, reject) => {
      this.http.post(`${env.URL_API_IMPRESORA}`, JSON.stringify(data))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
        });
    });
  }

}

