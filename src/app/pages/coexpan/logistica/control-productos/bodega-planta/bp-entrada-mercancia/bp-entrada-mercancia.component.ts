import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { IonButton, LoadingController, AlertController, IonTextarea, ToastController } from '@ionic/angular';
import { CxpService } from '../../../../../../providers/web-services/cxp/cxp.service';
import { GetRequestModel, PalletBobinasModel, SapPostModel, StsPalletModel, UserSapModel, PalletRecepcionModel } from '../../../../../../models/Registros.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bp-entrada-mercancia',
  templateUrl: './bp-entrada-mercancia.component.html',
  styleUrls: ['./bp-entrada-mercancia.component.scss']
})
export class BpEntradaMercanciaComponent implements OnInit, AfterViewInit {

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private cxpService: CxpService,
    private routes: Router,
  ) { }

  //#region VARIABLES
  pallets: PalletBobinasModel[] = [];
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
    }, 100);
  }


  textoCodigos(valor: string) {
    this.codigos = valor;
    if (this.codigos.length === 0) {
      this.btnEnviar.disabled = true;
    } else { this.btnEnviar.disabled = false; }
    console.log(this.codigos);
  }


  public obtenerDatosPallet(codbarramulti: string) {
    //#region VARIABLES
    const cbm = codbarramulti.trim();
    if (cbm.length <= 0) {
      this.messageToast('Escanée un Código de Pallet');
      return;
    }
    this.txtCodigos.disabled = true;
    this.txtCodigos.value = '';
    this.txtarea.spinner = true;
    console.log(cbm);
    let request: GetRequestModel<PalletBobinasModel>;
    //#endregion VARIABLES
    this.cxpService.cxpLogisticaGetPalletBobinas(cbm).then(datos => {
      request = JSON.parse(datos.toString());
      this.txtarea.spinner = false;
      console.log(request);
      if (request.Status.STATUS === 'T') {
        if (this.palletRepetido(request.Objeto.Pallet.CODBAR_MULTI)) {
          this.messageToast('El Pallet ya se encuentra en la lista.');
        } else {
          this.pallets.push(request.Objeto);
        }
      } else {
        if (request.Objeto.Pallet) {
          this.AlertaReimprimirEtiqueta(request);
        } else {
          this.messageToast(request.Status.MESSAGE);
        }
      }
      this.txtCodigos.disabled = false;
      setTimeout(() => {
        this.txtCodigos.setFocus();
      }, 100);
      this.existenitems();
    }, (err) => {
      console.log(err);
    });
  }

  public eliminarItem(nropallet: string) {
    for (let i = 0; i < this.pallets.length; i++) {
      if (this.pallets[i].Pallet.CODBAR_MULTI === nropallet) {
        this.pallets.splice(i, 1);
        this.messageToast(`Pallet ${nropallet} Quitado de la lista.`);
        this.existenitems();
      }
    }
    console.log(`Pallet Eliminado: ${nropallet}`);
  }

  public palletRepetido(nropallets: string): boolean {
    let existe = false;
    this.pallets.forEach(pt => {
      if (pt.Pallet.CODBAR_MULTI === nropallets) {existe = true; }
    });
    return existe;
  }

  public enviarEntradaMercancia() {
    const usersap: UserSapModel = JSON.parse(localStorage.getItem('usersap'));
    const postsap: SapPostModel<PalletBobinasModel[]> = new SapPostModel<PalletBobinasModel[]>();
    postsap.usuario = usersap.User;
    postsap.token = usersap.Token;
    postsap.objeto = this.pallets;
    let palletExito = 0;
    let palletError = 0;
    this.showLoading();
    this.cxpService.cxpLogisticaenviarEntradaMercancia(postsap).then((data) => {
      this.dismissLoading();
      let status: GetRequestModel<StsPalletModel[]> = new GetRequestModel<StsPalletModel[]>();
      status = JSON.parse(data.toString());
      if (status.Status.STATUS === 'T') {
        status.Objeto.forEach(pallet => {
          if (pallet.Estado === 'T') {
            palletExito += 1;
          } else {
            palletError += 1;
          }
        });
        //
        this.eliminarPalletConProblemas(this.pallets, status);
        //
        if (palletError > 0) {
          this.messageToast('Error al registrar estos Pallet. ');
        } else {
          this.messageToast('Pallet(s) registrado(s) en SAP Business One con éxito. ');
          this.pallets = [];
        }
      } else {
        this.messageToast('sesión expirada, vuelva a iniciar sesión. ');
        localStorage.removeItem('usersap');
        this.routes.navigateByUrl('pages/login');
      }
      this.existenitems();
      console.log(data);
    }, (err) => {
      this.existenitems();
      this.dismissLoading();
      this.messageToast(err);
    });
  }


  //#region Informacion Pallet
  async infoItem(nropallet: string) {
    let pallet: PalletBobinasModel = new PalletBobinasModel();
    pallet = this.obtenerPallet(nropallet);
    const str = this.generarListaBobinas(pallet);
    const alert = await this.alertCtrl.create({
      cssClass: 'alert-palletybobinas',
      header: `DETALLE PALLET ${nropallet}`,
      message: str,
      buttons: ['OK']
    });
    await alert.present();
  }


  obtenerPallet(nroPallet: string): PalletBobinasModel {
    let rtnPallet: PalletBobinasModel = new PalletBobinasModel();
    this.pallets.forEach(pallet => {
      if (pallet.Pallet.CODBAR_MULTI === nroPallet) {
        rtnPallet = pallet;
      }
    });
    return rtnPallet;
  }


  generarListaBobinas(pallet: PalletBobinasModel): string {
    //#region HTML
    let str = `
    <ion-list>
          <ion-item>
            <ion-label>OF - ${pallet.Pallet.ORDEN_FAB.substr(5, 20)}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>CLIENTE - ${pallet.Pallet.CLIENTE}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>PALLET ${pallet.Pallet.CORRELATIVO}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>KG BRUTO - ${pallet.Pallet.PESO_BRUTO}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>KG NETO ${pallet.Pallet.PESO_NETO}</ion-label>
          </ion-item>
        </ion-list>
        <br>
        <div><ion-label>Bobina(s)</ion-label></div></br>`;
    //#endregion HTML
    pallet.Bobinas.forEach(bob => {
      const strconst = `
      <ion-label>N° Bobina ${bob.CODBAR_BOB}</ion-label>
      <ul>
        <li>Producto: - ${bob.NOM_PRODUCTO}</li>
        <li>Medidas - ${bob.MEDIDAS}</li>
        <li>Kg Bruto - ${bob.PESO_BRUTO}</li>
        <li>Kg Neto - ${bob.PESO_NETO}</li>
        <li>Valor Resina - $${bob.PRECIO_RESINA}</li>
        <li>Valor Total - $${bob.VALOR_TOTAL}</li>
      </ul>
        </br>`;
      str += strconst;
    });
    return str;
  }
  //#endregion Informacion Pallet


  // TODO INTEGRACION 28-07-2021 Emisión Etiqueta Recepcion
  async AlertaReimprimirEtiqueta(mod: GetRequestModel<PalletBobinasModel>) {
    const alert = await this.alertCtrl.create({
      header: 'SAP Business One.',
      message: 'El Pallet ya se encuentra cargado en el sistema, desea reimprimir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log();
          }
        }, {
          text: 'Continuar',
          handler: () => {
            this.reemprimirEtiquetaRecepcion(mod);
          }
        }
      ]
    });
    await alert.present();
  }

  private reemprimirEtiquetaRecepcion(mod: GetRequestModel<PalletBobinasModel>) {
    const prm: PalletRecepcionModel = new PalletRecepcionModel();
    prm.codProducto = mod.Objeto.Pallet.COD_PRODUCTO;
    prm.descProducto = mod.Objeto.Pallet.NOM_PRODUCTO;
    prm.ordenFab = mod.Objeto.Pallet.ORDEN_FAB;
    prm.cliente = mod.Objeto.Pallet.CLIENTE;
    prm.medidas = mod.Objeto.Pallet.MEDIDAS;
    prm.cantBobinas = Number(mod.Objeto.Pallet.CANT_BOB);
    prm.corrPallet = Number(mod.Objeto.Pallet.CORRELATIVO);
    prm.corrPallet = Number(mod.Objeto.Pallet.CORRELATIVO);
    prm.pesoBruto = Number(mod.Objeto.Pallet.PESO_BRUTO);
    prm.pesoNeto = Number(mod.Objeto.Pallet.PESO_NETO);
    prm.idEtqMulti = mod.Objeto.Pallet.CODBAR_MULTI.toString();
    prm.ipImpresora = localStorage.getItem('ipimp');
    console.log(prm.ipImpresora);

    if (prm.ipImpresora !== null ||  prm.ipImpresora !== '') {
      this.cxpService.cxpReimprimirEtiquetaRecepcion(prm).then((data: any) => {
        this.messageToast(data.message);
      }, (err) => {
        this.messageToast('Problemas en el servicio. ');
        console.log(err);
      });
    } else {
      this.messageToast('Seleccione una impresora para continuar. ');
    }
  }


  private eliminarPalletConProblemas(pallet: PalletBobinasModel[], rq: GetRequestModel<StsPalletModel[]>) {
    const newpl: PalletRecepcionModel[] = [];
    pallet.forEach(pl => {
      rq.Objeto.forEach(rqpallet => {
        if (pl.Pallet.CODBAR_MULTI === rqpallet.CodBarra && rqpallet.Estado === 'T') {
          let pet: PalletRecepcionModel = new PalletRecepcionModel();
          pet.codProducto = pl.Pallet.COD_PRODUCTO;
          pet.descProducto = pl.Pallet.NOM_PRODUCTO;
          pet.ordenFab = pl.Pallet.ORDEN_FAB;
          pet.cliente = pl.Pallet.CLIENTE;
          pet.medidas = pl.Pallet.MEDIDAS;
          pet.cantBobinas = Number(pl.Pallet.CANT_BOB);
          pet.corrPallet = Number(pl.Pallet.CORRELATIVO);
          pet.pesoBruto = Number(pl.Pallet.PESO_BRUTO.replace(',', '.'));
          pet.pesoNeto = Number(pl.Pallet.PESO_NETO.replace(',', '.'));
          pet.idEtqMulti = pl.Pallet.CODBAR_MULTI;
          pet.ipImpresora = localStorage.getItem('ipimp');
          newpl.push(pet);
          pet = null;
        }
      });
    });
    this.imprimirEtiquetasRecepcion(newpl);
  }


  private imprimirEtiquetasRecepcion(pallets: PalletRecepcionModel[]) {
    console.log('Paso por metodo');

    const ipImpresora = localStorage.getItem('ipimp');
    let cantimp = 0;
    if (ipImpresora !== null ||  ipImpresora !== '') {
      pallets.forEach( pl => {
          this.cxpService.cxpReimprimirEtiquetaRecepcion(pl).then((dataa: any) => {
            cantimp++;
          }, (err => {
            console.log(err);
          }));
        });
      this.messageToast('Etiquetas Enviadas: ' + cantimp);
    } else {
      this.messageToast('Seleccione una impresora para continuar. ');
    }
  }


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

  async messageToast(msj: string) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 5000
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
      if (this.pallets[i].Pallet.CODBAR_MULTI === codpallet) {
        this.pallets.splice(i, 1);
        this.existenitems();
      }
    }
  }


  async AlertaEnviarEntradaSap() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'SAP Business One.',
      message: 'Enviar <strong>Entrada(s) de Mercancia(s)</strong>?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Continuar',
          handler: () => {
            this.enviarEntradaMercancia();
          }
        }
      ]
    });
    await alert.present();
  }
  //#endregion HERRAMIENTAS

}
