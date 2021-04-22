import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { GetRequestModel, InfoEtiquetaModel, PalletModel, ImpresoraEtiquetaPalletModel } from '../../../../../../models/Registros.model';
import { IonTextarea, IonButton, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CxpService } from '../../../../../../providers/web-services/cxp/cxp.service';

@Component({
  selector: 'app-bp-etq-reimprimir',
  templateUrl: './bp-etq-reimprimir.component.html',
  styleUrls: ['./bp-etq-reimprimir.component.scss']
})
export class BpEtqReimprimirComponent implements OnInit, AfterViewInit {

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private cxpService: CxpService,
  ) { }

  //#region VARIABLES
  pallets: PalletModel[] = [];
  codigos: string;
  arrayCod: string[];
  loading: any;
  isLoading = false;
  //#endregion VARIABLES
  //#region VIEWCHILD
  @ViewChild('btnEnviar') btnEnviar: IonButton;
  @ViewChild('codigos') txtCodigos: IonTextarea;
  //#endregion VIEWCHILD
  //#region MODEL HTML
  txtarea = {
    spinner: false,
  };
  //#endregion MODEL HTML

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.btnEnviar.disabled = true;
    setTimeout(() => {
      this.txtCodigos.setFocus();
    }, 200);
  }

  textoCodigos(valor: string) {
    this.codigos = valor;
    if (this.codigos.length === 0) {
      this.btnEnviar.disabled = true;
    } else { this.btnEnviar.disabled = false; }
    console.log(this.codigos);
  }

  public obtenerDatosPallet(codbarramulti: string) {
    // let pallet: PalletModel = new PalletModel();
    const datos: InfoEtiquetaModel = new InfoEtiquetaModel();
    let request: GetRequestModel<PalletModel> = new GetRequestModel<PalletModel>();
    //#region html
    this.txtCodigos.disabled = true;
    this.txtCodigos.value = '';
    this.txtarea.spinner = true;
    //#endregion html
    //#region condicion
    const cbm = codbarramulti.trim();
    if (cbm.length <= 0) {
      this.messageToast('Escanée un Código de Pallet', 2000);
      return;
    }
    if (cbm.length <= 11){
      datos.CodBobina = cbm;
      datos.CodPallet = 'N';
    } else {
      datos.CodBobina = 'N';
      datos.CodPallet = cbm;
    }
    //#endregion condicion

    this.cxpService.cxpObtenerInformacionEtiquetaPallet(datos).then( (data: string) => {
      request = JSON.parse(data.toString());
      if (request.Status.STATUS === 'T') {
        if (request.Objeto !== null) {
          this.pallets.push(request.Objeto);
        } else {
          this.messageToast(`Etiqueta de Pallet no encontrada.`, 2000);
        }
      } else {
        this.messageToast(request.Status.MESSAGE, 10000);
      }
      this.existenitems();
      //#region html
      this.txtCodigos.disabled = false;
      this.txtarea.spinner = false;
      setTimeout(() => {
        this.txtCodigos.setFocus();
      }, 100);
      //#endregion html
    }, (err) => {
      console.log(err);
      this.existenitems();
      //#region html
      this.txtCodigos.disabled = false;
      this.txtarea.spinner = false;
      //#endregion html
    });

    // this.txtCodigos.disabled = true;
    // this.txtCodigos.value = '';
    // this.txtarea.spinner = true;
    console.log(cbm);
  }

  public imprimirEtiquetas(){
    const datos: ImpresoraEtiquetaPalletModel = new ImpresoraEtiquetaPalletModel();
    let request: GetRequestModel<string[]> = new GetRequestModel<string[]>();
    const ip = localStorage.getItem('ipimp');
    if (ip) {
      datos.IpZebra = ip;
      datos.Pallets = this.pallets;
      this.cxpService.cxpReimprimirEtiquetaPallet(datos).then((data: string) => {
        console.log(data);
        request = JSON.parse(data.toString());
        if (request.Status.STATUS === 'T') {
          this.messageToast(request.Status.MESSAGE, 2000);
        } else {
          let str1 = 'Ocurrio un problema al imprimir: \n';
          request.Objeto.forEach(el => {
            str1 += `  - ${el}\n`;
          });
          this.messageToast(str1, 6000);
        }
      }, (err) => {
        console.log(err);
        this.messageToast(err, 6000);
      });
    } else {
      this.messageToast(`Selecciones una impresora en el menu.`, 2000);
    }
  }

  // public palletRepetido(nropallets: string): boolean {
  //   let existe = false;
  //   this.pallets.forEach(pt => {
  //     if (pt.CODBAR_MULTI === nropallets) {existe = true; }
  //   });
  //   return existe;
  // }

  // public enviarEntradaMercancia() {
  //   console.log('se envía para imprimir.');
  // }

  public eliminarItem(nropallet: string) {
    for (let i = 0; i < this.pallets.length; i++) {
      if (this.pallets[i].CODBAR_MULTI === nropallet) {
        this.pallets.splice(i, 1);
        this.messageToast(`Etiqueta ${nropallet} Quitado de la lista.`, 2000);
        this.existenitems();
      }
    }
    console.log(`Etiqueta Eliminada: ${nropallet}`);
  }

  //#region Informacion Pallet
  async infoItem(nropallet: string) {
    let pallet: PalletModel = new PalletModel();
    pallet = this.obtenerPallet(nropallet);
    const str = this.generarListaBobinas(pallet);
    const alert = await this.alertCtrl.create({
      cssClass: 'alert-palletybobinas',
      header: `DETALLE PALLET ${nropallet}`,
      message: str,
    });
    await alert.present();
  }

  obtenerPallet(nroPallet: string): PalletModel {
    let rtnPallet: PalletModel = new PalletModel();
    this.pallets.forEach(pallet => {
      if (pallet.CODBAR_MULTI === nroPallet) {
        rtnPallet = pallet;
      }
    });
    return rtnPallet;
  }

  generarListaBobinas(pallet: PalletModel): string {
    const str = `
    <ion-list>
          <ion-item>
            <ion-label>OF - ${pallet.ORDEN_FAB.substr(5, 20)}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>CLIENTE - ${pallet.CLIENTE}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>PALLET ${pallet.CORRELATIVO}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>KG BRUTO - ${pallet.PESO_BRUTO}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>KG NETO ${pallet.PESO_NETO}</ion-label>
          </ion-item>
        </ion-list>
        <br>`;
    return str;
  }
  //#endregion Informacion Pallet

  //#region HERRAMIENTAS
  private existenitems(): boolean {
    if (this.pallets.length > 0) {
      this.btnEnviar.disabled = false;
      return true;
    } else {
      this.btnEnviar.disabled = true;
      return false;
    }
  }

  async showLoading() {
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

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }

  async messageToast(msj: string, time: number) {
    const toast = await this.toastController.create({
      message: msj,
      duration: time
    });
    toast.present();
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

  removerPallet(codpallet: string){
    for (let i = 0; i < this.pallets.length; i++) {
      if (this.pallets[i].CODBAR_MULTI === codpallet) {
        this.pallets.splice(i, 1);
        this.existenitems();
      }
    }
  }
  //#endregion HERRAMIENTAS


}
