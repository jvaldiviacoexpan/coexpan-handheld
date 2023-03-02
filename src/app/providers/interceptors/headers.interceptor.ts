import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const ContentType = 'application/json; charset=UTF-8';
    const Accept = 'application/json';
    let authorization = '';
    // console.log(request.body.toString());
    if (localStorage.getItem('token') !== null) {
      authorization = localStorage.getItem('token');
    }
    console.log(request.method);

    if (request.method === 'GET') {
      request = request.clone({
                  setHeaders: {
                    Authorization: authorization,
                    'Content-Type': ContentType,
                    Accept,
                  },
      });
      console.log(request.url);
    } else {
      if (request.body.toString() === '[object FormData]') {
        console.log('Se envió un Archivo');
      } else {
        console.log(`url dada: ${request.url}`);
        if (request.url === 'https://localhost:44342/api/etq-bodega/recepcion-bobina'

        ) {
          // console.log('paso por nueva api');
          request = request.clone({
                    setHeaders: {
                      // Authorization: authorization,
                      'Content-Type': 'application/json',
                      Accept: 'application/json',
                    },
        });
        } else {
          request = request.clone({
                    setHeaders: {
                      Authorization: authorization,
                      'Content-Type': ContentType,
                      Accept,
                    },
        });
        }
      }
    }
    return next.handle(request);
  }
}
