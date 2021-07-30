import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AlertController, ToastController, IonButton, IonTextarea, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CxpService } from '../../../../../../providers/web-services/cxp/cxp.service';
import { InfoEtiquetaModel, GetRequestModel, PalletModel, StatusSqlModel } from '../../../../../../models/Registros.model';
import { createAnimation } from '@ionic/angular';
import { timeout } from 'rxjs/internal/operators';

@Component({
  selector: 'app-bp-eliminar-etiqueta',
  templateUrl: './bp-eliminar-etiqueta.component.html',
  styleUrls: ['./bp-eliminar-etiqueta.component.scss']
})
export class BpEliminarEtiquetaComponent implements OnInit, AfterViewInit {

  pallet: PalletModel;
  codigos: string;
  arrayCod: string[];
  loading: any;
  isLoading = false;

  txtarea = {
    spinner: false,
  };

  @ViewChild('btnEliminar') btnEliminar: IonButton;
  @ViewChild('codigos') txtCodigos: IonTextarea;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private cxpService: CxpService,
  ) { }


  ngOnInit(): void {
    this.alertComprobarUsuario();
  }

  ngAfterViewInit(): void {
    this.btnEliminar.disabled = true;
    this.txtCodigos.disabled = true;
  }



  // public comprobarDatoPallet(text: string) {
  //   const newtext = text.trim();
  //
  //   newtext !== '' && newtext.length >= 5 ?
  //   this.btnEliminar.disabled = false :
  //   this.btnEliminar.disabled = true;
  // }


  public eliminarEtiquetaPallet(){
    const nroPallet = this.pallet.CODBAR_MULTI;
    this.cxpService.cxpLogisticaEliminarEtiquetaPallet(nroPallet).then((data: string) => {
      // console.log(JSON.parse(data));
      const sql: StatusSqlModel = JSON.parse(data);
      console.log(sql);
      if (sql.Status.STATUS === 'T') {
        if (sql.Objeto[0].STATUS === 0) {
          this.toastMessage(sql.Objeto[0].MESSAGE, 'success', 4000);
          this.eliminarCard(600);
          setTimeout(() => {
            this.txtCodigos.setFocus();
            this.btnEliminar.disabled = true;
          }, 700);
        }
      } else {
        this.toastMessage(sql.Status.MESSAGE, 'warning', 4000);
      }
    });
  }



  public obtenerDatosPallet(codigo: string) {
    // let pallet: PalletModel = new PalletModel();
    const codigopost = codigo.trim();
    const datos: InfoEtiquetaModel = new InfoEtiquetaModel();
    let request: GetRequestModel<PalletModel> = new GetRequestModel<PalletModel>();

    if (codigopost === ''  ) {
      this.toastMessage('Ingrese un código.', 'warning', 2000);
      this.txtCodigos.value = '';
      return false;
    }
    //#region html
    this.txtCodigos.disabled = true;
    this.txtCodigos.value = '';
    this.txtarea.spinner = true;
    //#endregion html
    //#region condicion
    if (codigo.length <= 11){
      datos.CodBobina = codigopost;
      datos.CodPallet = 'N';
    } else {
      datos.CodBobina = 'N';
      datos.CodPallet = codigopost;
    }
    //#endregion condicion

    this.cxpService.cxpObtenerInformacionEtiquetaPallet(datos).then( (data: string) => {
      request = JSON.parse(data.toString());
      if (request.Status.STATUS === 'T') {
        if (request.Objeto !== null) {
          this.pallet = request.Objeto;
          this.btnEliminar.disabled = false;
          console.log(this.pallet);
        } else {
          this.toastMessage(`Etiqueta de Pallet no encontrada.`, 'warning', 2000);
          this.btnEliminar.disabled = true;
        }
      } else {
        this.toastMessage(request.Status.MESSAGE, 'warning', 10000);
        this.btnEliminar.disabled = true;
      }
      //#region html
      this.txtCodigos.disabled = false;
      this.txtarea.spinner = false;
      setTimeout(() => { this.txtCodigos.setFocus(); }, 100);
      //#endregion html
    }, (err) => {
      console.log(err);
      //#region html
      this.txtCodigos.disabled = false;
      this.txtarea.spinner = false;
      this.btnEliminar.disabled = true;
      //#endregion html
    });
  }


  async alertComprobarUsuario() {
    const alert = await this.alertCtrl.create({
      header: 'Administrador',
      subHeader: 'Ingrese las credenciales para continuar.',
      backdropDismiss: false,
      inputs: [
        {
          name: 'pass',
          type: 'password',
          placeholder: 'Password',
          attributes: {
            inputmode: 'decimal'
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.router.navigateByUrl('pages/cxp/control/bp');
          }
        },
        {
          text: 'Enviar',
          handler: (data) => {
            console.log(data);
            const Usuario = {
              User: '1002',
              Pass: data.pass,
            };
            this.showLoading();
            this.cxpService.cxpLogisticaExtrusionLogin(Usuario).then( (rq: string) => {
              const dt: any = JSON.parse(rq.toString());
              console.log(dt);
              if (dt.Status.STATUS === 'T' && dt.Objeto[0].STATUS === 1 ) {
                // console.log('bacan');
                this.txtCodigos.disabled = false;
                this.dismissLoading();
              } else if (dt.Status.STATUS === 'F') {
                this.toastMessage(`${dt.Status.MESSAGE}`, 'danger', 2000);
                this.dismissLoading();
                this.alertComprobarUsuario();
              } else if (dt.Status.STATUS === 'T' && dt.Objeto[0].STATUS === 0) {
                this.toastMessage('Credenciales Incorrectas.', 'danger', 2000);
                this.dismissLoading();
                this.alertComprobarUsuario();
              } else {
                this.toastMessage('Credenciales Incorrectas.', 'danger', 2050);
                this.dismissLoading();
                this.alertComprobarUsuario();
              }
            },
            (err) => {
              console.log(err);
              this.toastMessage(err, 'danger', 2000);
              this.dismissLoading();
              this.alertComprobarUsuario();
            });
          }
        }
      ]
    });
    await alert.present();
  }


  async alertEliminarEtiqueta() {
    const alert = await this.alertCtrl.create({
      header: `Etiqueta ${this.pallet.CODBAR_MULTI}`,
      subHeader: 'Esta seguro que desea eliminar esta Etiqueta?.',
      backdropDismiss: true,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Calcelar');
          }
        },
        {
          text: 'Confirmar',
          handler: (data) => {
            // console.log(`Eliminar: ${this.pallet.CODBAR_MULTI}`);
            this.eliminarEtiquetaPallet();
          }
        }
      ]
    });
    await alert.present();
  }


  async toastMessage(mensaje: string, status: string, time: number) {
    const toast = await this.toastCtrl.create({
      color: status,
      message: mensaje,
      duration: time
    });
    toast.present();
  }


  public eliminarCard(time: number) {
    const animation = createAnimation()
    .addElement(document.getElementById('cardbobina'))
    .duration(time)
    .direction('alternate')
    .iterations(1)
    .keyframes([
      { offset: 0, transform: 'scale(1)', opacity: '1' },
      { offset: 0.5, transform: 'scale(1.5)', opacity: '0.5'},
      { offset: 1, transform: 'scale(2)', opacity: '0'}
    ]);
    animation.play();
    setTimeout(() => {
      this.pallet = null;
    }, time);
    // setTimeout(() => {
    //   console.log(this.pallet);
    // }, time + 500);
  }


  // Metodo que elimina letra por letra el string digitalizado en el campo de texto
  public eliminarunoauno() {
    const text: string = this.txtCodigos.value;
    let cont = 0;
    let cont2 = text.length - 1;
    const arr: string[] = [];
    let newtext: string;
    for (let i = 0; i < text.length; i++) {
      arr.push(text.substring(cont, cont + 1));
      cont++;
    }
    const inter = setInterval(() => {
      // console.log(newtext);
      if (cont2 === -2) {
        clearInterval(inter);
        this.txtCodigos.setFocus();
      }
      newtext = arr.toString();
      this.txtCodigos.value = newtext.replace(/,/g, '');
      arr.splice(cont2, 1);
      cont2--;
    }, 90);
  }

  //#region Loading
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
  //#endregion Loading

}
