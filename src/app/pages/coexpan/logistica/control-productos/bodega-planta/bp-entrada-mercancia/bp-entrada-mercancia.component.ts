import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { IonButton, LoadingController, AlertController, IonTextarea } from '@ionic/angular';
import { CxpService } from '../../../../../../providers/web-services/cxp/cxp.service';
import { RegistrosModel, GetConsultaModel, GetConsultaModelV2, EstadoIngresoV2Model } from '../../../../../../models/Registros.model';

@Component({
  selector: 'app-bp-entrada-mercancia',
  templateUrl: './bp-entrada-mercancia.component.html',
  styleUrls: ['./bp-entrada-mercancia.component.scss']
})
export class BpEntradaMercanciaComponent implements OnInit, AfterViewInit {

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
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.btnEnviar.disabled = true;
  }


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

    this.cxpService.cxpLogisticaEntradaMercancia(registros).then( (res) => {
      console.log(res);
      mensaje = JSON.parse(res.toString());
      console.log(mensaje);
      mensaje.EstadoCodigos.forEach(status => {
        switch (status.ESTADO) {
          case 'F': err += 1; break;
          case 'T': suc += 1; break;
          default: break; } });
      this.dismiss();
      this.pstAlert(
        'Estado de Ingreso',
        `<strong>Correctas: ${suc} bob.<br></strong><br>
        <strong>Error: ${err} bob.<br></strong>`,
          );
    }, (err) => {
      console.log(err);
      this.dismiss();
    });
    this.txtCodigos.value = '';
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
  //#endregion


}
