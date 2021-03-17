import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bp-menu-planta',
  templateUrl: './bp-menu-planta.component.html',
  styleUrls: ['./bp-menu-planta.component.scss']
})
export class BpMenuPlantaComponent implements OnInit {

  constructor(private routes: Router) { }

  ngOnInit(): void {}

  pageEntradaMercancia() {
    this.routes.navigateByUrl('pages/cxp/control/bp/em');
  }

  pageSalidaMercancia() {
    this.routes.navigateByUrl('pages/cxp/control/bp/sm');
  }

}
