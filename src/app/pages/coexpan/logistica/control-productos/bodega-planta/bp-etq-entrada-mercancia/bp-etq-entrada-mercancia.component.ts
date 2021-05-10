import { ImpresoraPostModel } from './../../../../../../models/Registros.model';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { IonButton, LoadingController, AlertController, IonTextarea, ToastController } from '@ionic/angular';
import { CxpService } from '../../../../../../providers/web-services/cxp/cxp.service';
import { RegistrosModel, GetConsultaModelV2, EstadoIngresoV2Model, GetRequestModel, IMPRESORAModel, ImprimirEtqMultipleZebraModel, WsStatusV2Model } from '../../../../../../models/Registros.model';

@Component({
  selector: 'app-bp-entrada-mercancia',
  templateUrl: './bp-etq-entrada-mercancia.component.html',
  styleUrls: ['./bp-etq-entrada-mercancia.component.scss']
})
export class BpEtqEntradaMercanciaComponent implements OnInit, AfterViewInit {

  impresoras = new GetRequestModel<IMPRESORAModel[]>();
  codigos: string;
  arrayCod: string[];
  loading: any;
  isLoading = false;
  @ViewChild('btnEnviar') btnEnviar: IonButton;
  @ViewChild('codigos') txtCodigos: IonTextarea;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private cxpService: CxpService,
    private toastController: ToastController,
  ) { }

  ngOnInit(): void {
    this.cargarEtlPesaje();
  }

  ngAfterViewInit() {
    this.btnEnviar.disabled = true;
    this.txtCodigos.autofocus = true;
  }

  async cargarEtlPesaje(event?: any) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Preparando datos...',
    });
    await loading.present();
    this.cxpService.cxpLogisticaEjecutarEtlPesaje().then(data => {
      loading.dismiss();
      console.log(data);
      switch (data) {
        case '"0"':  this.pstAlert('Error!', 'Problema al cargar la información al sistema.'); break;
        case '"1"':
          console.log('Cargado con éxito');
          const ip = localStorage.getItem('ipimp');
          if (ip) {
            this.comprobarEstadoImpresora(ip);
            break;
          } else {
            this.obtenerImpresoras();
            break;
          }
        case '"3"': this.pstAlert('Error!', 'Carga de información cancelada.'); break;
        case '"5"': this.pstAlert('Error!', 'Error Desconocido.'); break;
        default: this.pstAlert('Error!', data.toString()); break;
      }
    }, (err) => {
      this.pstAlert('Error Grave', 'Problema lógico de parte del servidor.');
      console.log(err);
      if (event){
        event.target.complete();
        // loading.dismiss();
      }
      loading.dismiss();
    });
    if (event){
      event.target.complete();
    }
    // setTimeout(() => {
    //   console.log(event);
    // }, 3000);
  }

  //#region HERRAMIENTAS
  obtenerImpresoras() {
    let rq = new GetRequestModel<IMPRESORAModel[]>();
    this.cxpService.cxpLogisticaGetImpresora().then(data => {
      rq = JSON.parse(data.toString());
      // console.log(rq);
      this.impresoras = rq;
      this.alertselectimpresora();
    }, (err) => {
      console.log(err);
    });
  }

  async alertselectimpresora() {
    const inputss = [];
    this.impresoras.Objeto.forEach(im => {
      inputss.push(this.generarInput(im.NSERIAL, im.TAG_NOMBRE, im.IP));
    });

    const alert = await this.alertCtrl.create({
      cssClass: '',
      header: 'Selec. Impresora',
      inputs: inputss,
      buttons: [
        {
          text: 'OK',
          handler: (ip) => {
            // console.log(ip);
            localStorage.setItem('ipimp', ip);
            this.comprobarEstadoImpresora(ip);
          },
        },
      ],
    });
    await alert.present();
  }

  generarInput(dname: string, dlabel: string, dvalue: string): any {
    const input = {
      name: dname,
      type: 'radio',
      label: dlabel,
      value: dvalue,
    };
    return input;
  }
  //#endregion HERRAMIENTAS


  textoCodigos(valor: string) {
    this.codigos = valor;
    if (this.codigos.length === 0) {
      this.btnEnviar.disabled = true;
    } else { this.btnEnviar.disabled = false; }
    console.log(this.codigos);
  }

  revisionCodigos() {
    this.arrayCod = this.transformarArreglo(this.codigos);
    if (this.arrayCod.length === 0) {
      this.pstErrorCodigos();
    } else {
      this.pstConfirmarEnvio();
    }
  }

  enviarCodigos() {
    const registros: RegistrosModel = new RegistrosModel();
    registros.CodBarras = this.arrayCod;
    registros.FechaScan = this.obtenerFecha();
    registros.Bodega = 1;
    registros.IdUsuario = null;
    let mensaje: GetConsultaModelV2<EstadoIngresoV2Model>;
    let err = 0;
    let suc = 0;
    this.present();

    this.cxpService.cxpLogisticaEntradaMercancia(registros).then( (res) => {
      this.dismiss();
      console.log(res);
      mensaje = JSON.parse(res.toString());
      console.log(mensaje);
      mensaje.EstadoCodigos.forEach(status => {
        switch (status.ESTADO) {
          case 'F': err += 1; break;
          case 'T': suc += 1; break;
          default: break; } });
      if (mensaje.Status.STATUS === 'T') {
        let bobError = '';
        // let infobob = '';
        if (err > 0) {
        bobError = `<strong>Error: ${err} bob.<br></strong>`;
        }
        this.pstAlert(
          'Estado de Ingreso',
          `<strong>Correctas: ${suc} bob.<br></strong><br>
          ${bobError}`
        );
        if (err === 0){
          const datosImpresion = new ImprimirEtqMultipleZebraModel();
          datosImpresion.CodBarra = mensaje.EstadoCodigos[0].CODBARRA;
          datosImpresion.IpZebra = localStorage.getItem('ipimp');
          this.cxpService.cxpLogisticaImprimirEtiquetaMultimple(datosImpresion).then(dataImpresion => {
            console.log(dataImpresion);
          }, (errImpresion => {
            console.log(errImpresion);
          }));
        }
      } else if (mensaje.Status.STATUS === 'F') {
        this.pstAlert(
          'Error!',
          mensaje.Status.MESSAGE,
        );
      } else {
        this.pstAlert(
          'Error!',
          mensaje.Status.MESSAGE_EXCEPTION_DESCR,
        );
      }
    }, (errr: any) => {
      console.log(err);
      this.pstAlert(
        'Error de Servidor...',
        errr,
      );
      this.dismiss();
    });
    this.txtCodigos.value = '';
    this.btnEnviar.disabled = true;
    this.txtCodigos.setFocus();
  }


  //#region HERRAMIENTAS
  async pstErrorCodigos() {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: 'Ingrese 1 o más códigos para continuar...',
      buttons: [{ text: 'Ok' }]
    });
    await alert.present();
    this.btnEnviar.disabled = true;
    this.txtCodigos.value = '';
  }

  async pstConfirmarEnvio() {
    const alert = await this.alertCtrl.create({
      cssClass: 'loading',
      header: 'Confirmar Envío',
      message: 'Desea enviar los <strong>Códigos de Bobinas</strong> ?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('no se envió :(');
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.enviarCodigos();
          }
        }
      ]
    });
    await alert.present();
  }

  async present() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      cssClass: 'loading',
      message: 'Enviando...',
      // duration: 5000,
    }).then(a => {
      a.present().then(() => {
        // console.log('presented');
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async pstAlert(cab: string, cuerpo: string, subcab?: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'loading',
      header: cab,
      subHeader: subcab,
      message: cuerpo,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.txtCodigos.setFocus();
          }
        }
      ]
    });
    await alert.present();
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }

  obtenerFecha(): string {
    const fechaDate = new Date();
    let fechaString = '';
    const anio = fechaDate.getFullYear();
    let dia = '';
    let mes = '';
    let hora = '';
    let minuto = '';
    let segundo = '';

    if (fechaDate.getDate() < 10) {
        dia = `0${fechaDate.getDate()}`;
    } else { dia = fechaDate.getDate().toString(); }

    if (fechaDate.getMonth() < 10) {
        mes = `0${fechaDate.getMonth() + 1}`;
    } else { mes = (fechaDate.getMonth() + 1).toString(); }

    if (fechaDate.getHours() < 10) {
        hora = `0${fechaDate.getHours()}`;
    } else { hora = fechaDate.getHours().toString(); }

    if (fechaDate.getMinutes() < 10) {
        minuto = `0${fechaDate.getMinutes()}`;
    } else { minuto = fechaDate.getMinutes().toString(); }

    if (fechaDate.getSeconds() < 10) {
        segundo = `0${fechaDate.getSeconds()}`;
    } else { segundo = fechaDate.getSeconds().toString(); }
    fechaString = `${anio}${mes}${dia} ${hora}:${minuto}:${segundo}`;
    return fechaString;
  }

  transformarArreglo(codigos: string): string[] {
    const arrayCadena = codigos.trim().split(' ');
    const arrayCadenaClean = arrayCadena.filter(Boolean);
    const arrayClean = [...new Set(arrayCadenaClean)];
    return arrayClean;
  }

  async messageToast(msj: string, time: number) {
    const toast = await this.toastController.create({
      message: msj,
      duration: time,
    });
    toast.present();
  }

  comprobarEstadoImpresora(ip: string) {
    let status: GetRequestModel<[]> = new GetRequestModel<[]>();
    const impresora: ImpresoraPostModel = new ImpresoraPostModel();
    impresora.ipAddress = ip;
    this.cxpService.cxpEstadoImpresora(impresora).then(data => {
      status = JSON.parse(data.toString());
      console.log(status);

      if (status.Status.STATUS === 'T') {
        status.Objeto.forEach(el => {
          this.messageToast(el, 2000);
        });
      } else {
        this.messageToast(status.Status.MESSAGE, 5000);
      }
    }, (err) => {
      this.messageToast(err, 5000);
    });
  }
  //#endregion HERRAMIENTAS


}
