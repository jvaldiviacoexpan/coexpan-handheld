import { Component, OnInit, ViewChild, AfterViewInit, Output } from '@angular/core';
import { IonInput, IonButton, ToastController, AlertController, MenuController } from '@ionic/angular';
import { CxpService } from '../../../../providers/web-services/cxp/cxp.service';
import { Router } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { LoginModel, MessageModel, UserSapModel } from '../../../../models/Registros.model';


@Component ({
  selector: 'app-bp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('user') user: IonInput;
  @ViewChild('pass') pass: IonInput;
  @ViewChild('btnEnviar') btnEnviar: IonButton;

  spinner = false;

  constructor(
    private cxpService: CxpService,
    private toastCtrl: ToastController,
    private route: Router,
    private alertCtrl: AlertController,
    private menuCtrl: MenuController,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(){
    this.btnEnviar.disabled = true;
  }

  // onEstadoUsuario() {
  //   this.estadoUsuario.emit();
  // }

  checkUserPassword() {
    if ( this.user.value.toString().length > 0 && this.pass.value.toString().length > 0 ) {
      this.btnEnviar.disabled = false;
    } else {
      this.btnEnviar.disabled = true;
    }
  }

  public registrar(){
    //#region Variables
    this.spinner = true;
    const usuario: LoginModel = new LoginModel();
    usuario.user = this.user.value.toString();
    usuario.password = this.pass.value.toString();
    usuario.companydb = 'SBO_COEXPAN_OFI';
    // usuario.companydb = 'Z_SBO_COEXPAN_TEST';
    this.btnEnviar.disabled = true;
    //#endregion Variables

    this.cxpService.cxpLogisticaLogin(usuario).then(data => {
      const rq: MessageModel = JSON.parse(data.toString());
      // console.log(rq);
      if (rq.ID_SAP === 0) {
        // this.toastMesssage('Credenciales Correctas');
        const usersap: UserSapModel = new UserSapModel();
        usersap.User = usuario.user;
        usersap.Token = rq.TOKEN;
        const strUserSap: string = JSON.stringify(usersap);
        localStorage.setItem('usersap', strUserSap);
        this.route.navigateByUrl('/');
        setTimeout(() => {
          window.location.reload();
        }, 200);
      } else {
        this.toastMesssage('Error con las credenciales, vuelva a intentarlo');
      }
      this.spinner = false;
      //#region Componentes
      const appComponent: AppComponent = new AppComponent(this.route, this.cxpService, this.toastCtrl, this.alertCtrl, this.menuCtrl);
      appComponent.textoBtnlo();
      //#endregion Componentes
      this.btnEnviar.disabled = false;
      // console.log(rq);
    }, (err) => {
      console.log(err);
      this.btnEnviar.disabled = false;
      this.spinner = false;
    });
  }

  async toastMesssage(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }


}
