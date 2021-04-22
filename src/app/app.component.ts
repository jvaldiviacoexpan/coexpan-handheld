import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetRequestModel, IMPRESORAModel, ImpresoraPostModel, MessageModel } from './models/Registros.model';
import { CxpService } from './providers/web-services/cxp/cxp.service';
import { ToastController, AlertController, MenuController, IonItem } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: `./app.component.html`,
  styleUrls: ['./app-component.scss'],
})
export class AppComponent implements OnInit {

  //#region Objetos y Variables
  impresoras = new GetRequestModel<IMPRESORAModel[]>();
  impspinner = false;
  @ViewChild('btnImpresora') btnimp: IonItem;
  btnlo = {
    enabled: false,
    texto: 'Iniciar Sesión',
  };
  //#endregion Objetos y Variables


  constructor(
    private routes: Router,
    private cxpService: CxpService,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    private menu: MenuController,
  ) {}

  ngOnInit() {
    this.textoBtnlo();
  }

  menuPlanta(){
    this.routes.navigateByUrl('pages/cxp/control/bp');
    this.menu.close();
  }

  menuBodegaRenca(){
    this.routes.navigateByUrl('pages/cxp/control/br');
    this.menu.close();
  }

  menuInicio(){
    this.routes.navigateByUrl('/');
    this.menu.close();
  }

  //#region Login-Logout
  loginLogoutSap() {
    //#region Variables
    let request: MessageModel = new MessageModel();
    const user = localStorage.getItem('usersap');
    let logout = {
      user: '',
      token: ''
    };
    logout = JSON.parse(user);
    localStorage.getItem('usersap');
    //#endregion Variables
    if (user) {
      this.AlertaCerrarSesion();
    } else {
      this.menu.toggle();
      this.routes.navigateByUrl('pages/login');
    }
  }

  cerrarSesionSap(){
     //#region Variables
    let request: MessageModel = new MessageModel();
    const user = localStorage.getItem('usersap');
    let logout = {
      user: '',
      token: ''
    };
    logout = JSON.parse(user);
    localStorage.getItem('usersap');
    //#endregion Variables
    logout = JSON.parse(user);
    localStorage.getItem('usersap');
    this.cxpService.cxpLogisticaLogout(logout).then( (data) => {
      console.log(data);
      request = JSON.parse(data.toString());
      this.messageToast(request.MESSAGE, 2000);
      localStorage.removeItem('usersap');
      this.textoBtnlo();
      this.menu.toggle();
      this.routes.navigateByUrl('/');
    }, (err) => {
      console.log(err);
    });
  }

  public textoBtnlo() {
    const user = localStorage.getItem('usersap');
    // console.log(user);
    if (user) {
      this.btnlo.texto = 'Cerrar Sesión SAP BO.';
    } else {
      this.btnlo.texto = 'Iniciar Sesión SAP BO.';
    }
  }

  async AlertaCerrarSesion() {
    const alert = await this.alertCtrl.create({
      cssClass: '',
      header: 'SAP Business One',
      message: 'Presione <strong>Continuar</strong> para cerrar la sesión.',
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
            this.cerrarSesionSap();
          }
        }
      ]
    });
    await alert.present();
  }
  //#endregion Login-Logout

  //#region Impresora
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

  comprobarEstadoImpresora(ip: string) {
    //#region Variables
    this.impspinner = true;
    this.btnimp.disabled = true;
    let status: GetRequestModel<[]> = new GetRequestModel<[]>();
    const impresora: ImpresoraPostModel = new ImpresoraPostModel();
    impresora.ipAddress = ip;
    //#endregion Variables
    this.cxpService.cxpEstadoImpresora(impresora).then(data => {
      status = JSON.parse(data.toString());
      // console.log(status);
      if (status.Status.STATUS === 'T') {
        let time = 2000;
        status.Objeto.forEach(el => {
          this.messageToast(el, time);
          console.log(el);
          time += 2000;
        });
      } else if (status.Status.STATUS === 'F') {
        let str = `Error con la impresora.\n`;
        status.Objeto.forEach(el => {
          str += ` - ${el}\n`;
        });
        this.messageToast(str, 5000);
      } else {
        const str = `${status.Status.MESSAGE}\n${status.Status.MESSAGE_EXCEPTION_DESCR}`;
        this.messageToast(str, 5000);
      }
      //#region Variables
      this.impspinner = false;
      this.btnimp.disabled = false;
      //#endregion Variables
    }, (err) => {
      this.messageToast(err, 5000);
      //#region Variables
      this.impspinner = false;
      this.btnimp.disabled = false;
      //#endregion Variables
    });
  }
  //#endregion Impresora

  //#region _Herramientas
  async messageToast(msj: string, time: number) {
    const toast = await this.toastController.create({
      message: msj,
      duration: time,
    });
    toast.present();
  }

  public prueba() {
    console.log('Hola Hijo mio.');
  }
  //#endregion Herramientas

}
