import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { IonTextarea, IonButton, AlertController, LoadingController } from '@ionic/angular';
import { CxpService } from '../../../../../../providers/web-services/cxp/cxp.service';
import { RegistrosModel, GetConsultaModel } from '../../../../../../models/Registros.model';
import { catchError } from 'rxjs/internal/operators';

@Component({
  selector: 'app-br-egreso',
  templateUrl: './br-egreso.component.html',
  styleUrls: ['./br-egreso.component.scss']
})
export class BrEgresoComponent implements OnInit, AfterViewInit {


  @ViewChild('codigos') htmlCodigos: IonTextarea;
  @ViewChild('btnenviar') htmlEnviar: IonButton;
  loading: any;
  isLoading = false;

  constructor(
    private cxpService: CxpService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.htmlEnviar.disabled = true;
    this.htmlCodigos.setFocus();
  }


  revisarTexto(str: string) {
    if (str.length === 0) {
      this.htmlEnviar.disabled = true;
    } else {
      this.htmlEnviar.disabled = false;
    }
  }

  enviarCodigos(codigos: string) {
    this.present();
    this.htmlEnviar.disabled = true;
    const registro: RegistrosModel = new RegistrosModel();
    let mensaje: GetConsultaModel;
    let exi = 0;
    let err = 0;

    registro.FechaScan = '2020/03/08';
    registro.IdUsuario = 1;
    // console.log(this.htmlCodigos.value);
    const arrayCadena = this.transformarArreglo(codigos);
    registro.CodBarras = arrayCadena;
    // console.log(registro.CodBarras);
    if (registro.CodBarras.length === 0) {
      this.presentAlert(
        'Error', 'Debe Escanear para poder enviar los códigos', ''
      );
      this.dismiss();
      this.htmlCodigos.value = '';
    } else {
      console.log(registro.CodBarras);
      this.cxpService.cxpBrEnviarEgreso(registro).then( (res) => {
        mensaje = JSON.parse(res.toString());
        console.log(mensaje);
        mensaje.EstadoCodigos.forEach(status => {
          switch (status.ESTADO) {
            case 'T': exi += 1; break;
            case 'F': err += 1; break;
            default: break;
          }
        });
        this.dismiss();
        this.presentAlert(
          'Estado de Ingreso',
          `<strong>Correctos: ${exi} bob.<br></strong><br>
          <strong>Error: ${err} bob.<br></strong>`,
          ` `
        );
      }, (err) => {
        console.log(err);
        this.dismiss();
      });
      this.htmlCodigos.value = '';
      this.htmlCodigos.setFocus();
    }
  }


  //#region Herramientas
  transformarArreglo(codigos: string): string[] {
    const arrayCadena = codigos.trim().split(' ');
    const arrayCadenaClean = arrayCadena.filter(Boolean);
    const arrayClean = [...new Set(arrayCadenaClean)];
    return arrayClean;
  }

  async presentAlert(cab: string, cuerpo: string, subcab?: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'loading',
      header: cab,
      subHeader: subcab,
      message: cuerpo,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.htmlCodigos.setFocus();
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertConfirm(codigos: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'loading',
      header: 'Confirmar Envío',
      message: 'Desea enviar los <strong>Códigos de Bobinas</strong> ?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('no se envio');
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.enviarCodigos(codigos);
          }
        }
      ]
    });
    await alert.present();
  }

  // async loadingData(str: string) {
  //   this.loading = await this.loadingCtrl.create({
  //     cssClass: 'my-custom-class',
  //     message: str,
  //   });
  //   return this.loading.present();
  // }


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

  async dismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }


  //#endregion




}
