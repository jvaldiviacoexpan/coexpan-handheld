import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  } from 'src/app/models/Registros.model';
import { CxpService } from '../../../../providers/web-services/cxp/cxp.service';
import { MenuController } from '@ionic/angular';
import { GetRequestModel } from '../../../../models/Registros.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  constructor(
    private router: Router,
    private cxpService: CxpService,
    private menu: MenuController,
  ) { }

  ID = 'ID20274622';

  ngOnInit(): void {
    this.obtenerToken(this.ID);
  }

  pageInventario(){
    console.log('navegar al inventario');
  }

  pageLogistica(){
    this.router.navigateByUrl('pages/cxp/control/inicio');
  }

  obtenerToken(id: string){
    let rq = new GetRequestModel<string>();
    this.cxpService.obtenerToken(id).then(data => {
      rq = JSON.parse(data.toString());
      localStorage.setItem('token', rq.Objeto);
      console.log(rq);
    }, (err) => {
      console.log(err);
    });
  }

  openMenu() {
    this.menu.toggle();
  }

}
