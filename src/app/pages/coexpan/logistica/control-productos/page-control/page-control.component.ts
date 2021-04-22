import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-page-control',
  templateUrl: './page-control.component.html',
  styleUrls: ['./page-control.component.scss']
})
export class PageControlComponent implements OnInit {

  constructor(
    private route: Router,
    private menu: MenuController,
  ) { }

  ngOnInit(): void { }

  pageBodegasCxp() {
    this.route.navigateByUrl('pages/cxp/control/bodegas');
  }

  openMenu() {
    this.menu.open();
  }

}
