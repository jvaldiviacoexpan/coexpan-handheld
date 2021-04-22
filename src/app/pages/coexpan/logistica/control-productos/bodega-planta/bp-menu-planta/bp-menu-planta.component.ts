import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UserSapModel } from '../../../../../../models/Registros.model';

@Component({
  selector: 'app-bp-menu-planta',
  templateUrl: './bp-menu-planta.component.html',
  styleUrls: ['./bp-menu-planta.component.scss']
})
export class BpMenuPlantaComponent implements OnInit {

  constructor(
    private routes: Router,
    private menu: MenuController,
  ) { }

  ngOnInit(): void { }

  pageEtqEntradaMercancia() {
    this.routes.navigateByUrl('pages/cxp/control/bp/etqem');
  }

  pageReimprimirEtiqueta() {
    this.routes.navigateByUrl('pages/cxp/control/bp/reimprimiretq');
  }

  pageEntradaMercancia() {
    // this.routes.navigateByUrl('pages/cxp/control/bp/em');
    const strUserSap = localStorage.getItem('usersap');
    const usersap: UserSapModel = JSON.parse(strUserSap);
    if (usersap !== null) {
      this.routes.navigateByUrl('pages/cxp/control/bp/em');
    } else {
      this.routes.navigateByUrl('pages/login');
    }
  }

  pageSalidaMercancia() {
    this.routes.navigateByUrl('pages/cxp/control/bp/sm');
  }

  openMenu() {
    this.menu.toggle();
  }

}
