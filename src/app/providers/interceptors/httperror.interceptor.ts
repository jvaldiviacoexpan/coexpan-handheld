import { Router } from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpHandler, HttpRequest, HttpInterceptor} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/internal/operators';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor( protected router: Router, public toastController: ToastController ) {}

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
                this.presentToast(`Sesión expirada, vuelva a Iniciar Sesión`, 6000);
                break;
          case 500:
                this.presentToast(`Error en el sector Lógico del Servidor`, 6000);
                break;

          default:
              this.presentToast(`${errorMessage}`, 6000);
              break;
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
