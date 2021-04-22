import { Router } from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpHandler, HttpRequest, HttpInterceptor} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError, timeout} from 'rxjs/internal/operators';
import { ToastController } from '@ionic/angular';
import { CxpService } from '../web-services/cxp/cxp.service';
import { GetRequestModel } from '../../models/Registros.model';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorInterceptor implements HttpInterceptor {

  ID = 'ID20274622';

  constructor(
    protected router: Router,
    public toastController: ToastController,
    protected cxpService: CxpService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError(error => {
        let errorMessage = '';
        if (error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Client-side error: ${error.error.message}`;
        } else {
          // backend error
          errorMessage = `Server-side error: ${error.status} ${error.message}`;
        }

      // aquí podrías agregar código que muestre el error en alguna parte fija de la pantalla.
        switch (error.status) {
          case 401:
                localStorage.removeItem('token');
                let rq = new GetRequestModel<string>();
                this.cxpService.obtenerToken(this.ID).then( (data) => {
                  rq = JSON.parse(data.toString());
                  localStorage.setItem('token', rq.Objeto);
                  console.log(data);
                }, (err) => {
                  console.log(err);
                });
                this.presentToast(`Sesión expirada, se refrescara la App`, 5000);
                setTimeout(() => {
                  window.location.reload();
                }, 5000);
                break;
          case 404:
                this.presentToast(`Solicitud HTTP (API) no encontrada.`, 5000); break;
          case 500:
                this.presentToast(`Error en el sector Lógico del Servidor.`, 5000); break;
          case 504:
                this.presentToast(`Servidor Desconectado.`, 5000); break;
          default:
              this.presentToast(`${errorMessage}`, 5000); break;
        }
        return throwError(errorMessage);

      }),
    );
  }

  async presentToast(mensaje: string, duracion: number) {
    const toast = await this.toastController.create({
      message: mensaje, duration: duracion,
    });
    toast.present();
  }


}
